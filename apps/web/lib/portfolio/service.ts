import {
  PortfolioDashboardData,
  PortfolioAsset,
  PortfolioScenarioInput,
  OptimizationConfig,
  OptimizationResult,
  PortfolioStrategy
} from '@petrosquare/types';
import {
  EconomicsConnector,
  ProductionConnector,
  RiskConnector,
  MarketsConnector
} from '../data-fabric/connectors';
import { optimizePortfolio } from './engine';

// Mock store for strategies
let STRATEGY_STORE: PortfolioStrategy[] = [];

function generateMockAssetDetails(id: string): Partial<PortfolioAsset> {
    // Deterministic mock based on ID hash or similar
    const seed = id.charCodeAt(0) + (id.charCodeAt(1) || 0);
    return {
        base_volatility: 0.15 + (seed % 20) / 100, // 15-35%
        base_carbon_intensity: 10 + (seed % 30), // 10-40 kg/boe
        liquidity_impact: 30 + (seed % 60), // days
        type: seed % 2 === 0 ? 'CONVENTIONAL' : 'SHALE',
        region: seed % 3 === 0 ? 'Permian' : 'WCSB',
        country: seed % 3 === 0 ? 'US' : 'CA'
    };
}

export const PortfolioService = {
    async getDashboardData(): Promise<PortfolioDashboardData> {
        // 1. Fetch Core Data
        const [portfolioItems, riskMetrics, productionForecast, marketSummary] = await Promise.all([
            EconomicsConnector.getPortfolio(),
            RiskConnector.getRiskMetrics(),
            ProductionConnector.getForecast({} as any), // Base case
            MarketsConnector.getSummary()
        ]);

        // 2. Transform into PortfolioAsset
        const assets: PortfolioAsset[] = portfolioItems.map(item => {
            const details = generateMockAssetDetails(item.asset_id);
            const riskScore = riskMetrics[item.asset_id] || 50;

            // Composite Score Logic
            // NPV (norm) * 0.4 + IRR (norm) * 0.3 - Risk * 0.2 - Carbon * 0.1
            const npvScore = Math.min(Math.max(item.npv / 10000000, 0), 1) * 100; // Normalize to 0-100 roughly
            const composite = (npvScore * 0.4) + (item.roi * 2 * 0.3) - (riskScore * 0.2) - ((details.base_carbon_intensity || 20) * 0.1);

            return {
                id: item.asset_id,
                name: item.asset_name,
                type: details.type as any,
                region: details.region as any,
                country: details.country as any,
                base_npv: item.npv,
                base_irr: item.roi, // assuming ROI ~ IRR for mock
                base_volatility: details.base_volatility || 0.2,
                base_carbon_intensity: details.base_carbon_intensity || 25,
                liquidity_impact: details.liquidity_impact || 30,
                risk_score: riskScore,
                composite_score: Math.max(0, Math.min(100, composite)),
                rank_change: 'SAME',
                scenario_npv: item.npv,
                scenario_irr: item.roi
            };
        });

        // 3. Create or Get Current Strategy
        // If no strategy exists, create a default "Current Allocation" strategy
        let currentStrategy = STRATEGY_STORE.find(s => s.status === 'APPROVED');
        if (!currentStrategy) {
            // Run a base optimization to generate a baseline strategy
            const baseConfig: OptimizationConfig = {
                constraints: {
                    max_capital_budget: 100000000, // 100M
                    min_liquidity: 5000000,
                    max_volatility: 0.25,
                    max_carbon_intensity: 50,
                    min_irr: 10,
                    mandatory_asset_ids: []
                },
                objective: 'BALANCED',
                scenario: {
                    oil_price_adjustment: 0,
                    gas_price_adjustment: 0,
                    carbon_tax: 0,
                    production_outage: 0,
                    opex_inflation: 0,
                    capex_inflation: 0,
                    fiscal_regime_change: false
                }
            };
            const result = optimizePortfolio(assets, baseConfig, 100000000);
            currentStrategy = {
                id: result.strategy_id,
                name: 'Current Portfolio Baseline',
                version: 1,
                author_id: 'system',
                created_at: new Date().toISOString(),
                status: 'APPROVED',
                result: result
            };
            STRATEGY_STORE.push(currentStrategy);
        }

        return {
            current_strategy: currentStrategy,
            scenarios: [], // Could list saved scenarios
            assets,
            alerts: 3 // Mock alert count
        };
    },

    async runOptimization(config: OptimizationConfig, budget: number): Promise<OptimizationResult> {
        // Fetch assets (fresh)
        const dashboard = await this.getDashboardData();
        const assets = dashboard.assets;

        // Run Engine
        return optimizePortfolio(assets, config, budget);
    },

    async saveStrategy(strategy: PortfolioStrategy): Promise<void> {
        STRATEGY_STORE.push(strategy);
    }
};
