import {
  PortfolioAsset,
  OptimizationConfig,
  OptimizationResult,
  CapitalAllocation,
  EfficientFrontierPoint,
  PortfolioScenarioInput,
} from '@petrosquare/types';

export function calculateMetrics(
    weights: number[],
    assets: PortfolioAsset[],
    scenario: PortfolioScenarioInput
) {
    let totalNpv = 0;
    let weightedIrr = 0;

    // Apply scenario factors
    const oilPriceFactor = 1 + (scenario.oil_price_adjustment || 0) / 100;
    const carbonTax = scenario.carbon_tax || 0; // $/tonne

    assets.forEach((asset, i) => {
        const w = weights[i];
        if (w === 0) return;

        // Apply simplistic scenario impacts
        const npv = asset.base_npv * oilPriceFactor - (asset.base_carbon_intensity * carbonTax * 1000); // Mock impact
        const irr = asset.base_irr * oilPriceFactor;

        totalNpv += npv * w;
        weightedIrr += irr * w;
    });

    // Volatility (Risk) Calculation
    // Using simplified Constant Correlation Model (rho = 0.3)
    const rho = 0.3;
    let variance = 0;
    for (let i = 0; i < assets.length; i++) {
        if (weights[i] === 0) continue;
        for (let j = 0; j < assets.length; j++) {
            if (weights[j] === 0) continue;
            const sigmaI = assets[i].base_volatility;
            const sigmaJ = assets[j].base_volatility;
            if (i === j) {
                variance += weights[i] * weights[i] * sigmaI * sigmaI;
            } else {
                variance += weights[i] * weights[j] * sigmaI * sigmaJ * rho;
            }
        }
    }
    const volatility = Math.sqrt(variance);

    // Carbon Intensity
    let weightedCarbon = 0;
    let weightedLiquidity = 0;
    assets.forEach((asset, i) => {
        weightedCarbon += weights[i] * asset.base_carbon_intensity;
        weightedLiquidity += weights[i] * (asset.liquidity_impact || 30);
    });

    return {
        npv: totalNpv,
        irr: weightedIrr,
        volatility,
        carbonIntensity: weightedCarbon,
        liquidityRunway: weightedLiquidity / 30 // Convert days to months approx
    };
}

export function optimizePortfolio(
    assets: PortfolioAsset[],
    config: OptimizationConfig,
    budget: number
): OptimizationResult {
    const numSimulations = config.num_simulations || 1000;
    const results: { metrics: any, weights: number[] }[] = [];
    const validResults: { metrics: any, weights: number[] }[] = [];

    for (let s = 0; s < numSimulations; s++) {
        // Generate random weights
        let weights = assets.map(() => Math.random());

        // Enforce mandatory assets
        if (config.constraints.mandatory_asset_ids?.length > 0) {
            weights = weights.map((w, i) => {
                if (config.constraints.mandatory_asset_ids.includes(assets[i].id)) {
                     return Math.max(w, 0.05); // Ensure at least 5% allocation
                }
                return w;
            });
        }

        // Normalize
        const sumWeights = weights.reduce((a, b) => a + b, 0);
        weights = weights.map(w => w / sumWeights);

        const metrics = calculateMetrics(weights, assets, config.scenario);

        // Check Constraints
        let valid = true;
        if (config.constraints.max_volatility && metrics.volatility > config.constraints.max_volatility) valid = false;
        if (config.constraints.min_irr && metrics.irr < config.constraints.min_irr) valid = false;
        if (config.constraints.max_carbon_intensity && metrics.carbonIntensity > config.constraints.max_carbon_intensity) valid = false;

        // Basic check for liquidity constraint if interpreted as months
        // if (config.constraints.min_liquidity && metrics.liquidityRunway < config.constraints.min_liquidity) valid = false;

        if (valid) {
            validResults.push({ metrics, weights });
        }
        results.push({ metrics, weights });
    }

    // Identify Efficient Frontier
    // Sort by Risk (Volatility)
    // For each risk level, find max Return (NPV or IRR)
    const frontierPoints: EfficientFrontierPoint[] = [];
    const sortedByRisk = [...results].sort((a, b) => a.metrics.volatility - b.metrics.volatility);

    // Binning for simplified frontier
    const bins = 20;
    const minVol = sortedByRisk[0]?.metrics.volatility || 0;
    const maxVol = sortedByRisk[sortedByRisk.length - 1]?.metrics.volatility || 1;
    const step = (maxVol - minVol) / bins;

    if (results.length > 0 && maxVol > minVol) {
        for (let i = 0; i < bins; i++) {
            const binMin = minVol + i * step;
            const binMax = minVol + (i + 1) * step;
            const inBin = sortedByRisk.filter(r => r.metrics.volatility >= binMin && r.metrics.volatility < binMax);

            if (inBin.length > 0) {
                // Find max return in bin
                const bestInBin = inBin.reduce((prev, current) => (prev.metrics.npv > current.metrics.npv) ? prev : current);
                frontierPoints.push({
                    risk: bestInBin.metrics.volatility,
                    return: bestInBin.metrics.npv, // Or IRR depending on view
                    sharpe_ratio: bestInBin.metrics.npv / bestInBin.metrics.volatility, // Simplified
                    allocation_id: 'alloc-' + i // Placeholder
                });
            }
        }
    }

    // Find Optimal Allocation based on Objective
    let optimal = validResults[0] || results[0];
    if (validResults.length > 0) {
        if (config.objective === 'MAX_NPV') {
            optimal = validResults.reduce((prev, current) => (prev.metrics.npv > current.metrics.npv) ? prev : current);
        } else if (config.objective === 'MIN_VOLATILITY') {
            optimal = validResults.reduce((prev, current) => (prev.metrics.volatility < current.metrics.volatility) ? prev : current);
        } else if (config.objective === 'MAX_IRR') {
             optimal = validResults.reduce((prev, current) => (prev.metrics.irr > current.metrics.irr) ? prev : current);
        } else if (config.objective === 'MIN_CARBON') {
             optimal = validResults.reduce((prev, current) => (prev.metrics.carbonIntensity < current.metrics.carbonIntensity) ? prev : current);
        } else {
            // Balanced (Max Sharpe)
            optimal = validResults.reduce((prev, current) => {
                const srPrev = prev.metrics.npv / prev.metrics.volatility;
                const srCurr = current.metrics.npv / current.metrics.volatility;
                return (srPrev > srCurr) ? prev : current;
            });
        }
    }

    const optimalAllocation: CapitalAllocation[] = assets.map((asset, i) => ({
        asset_id: asset.id,
        allocation_percentage: optimal.weights[i] * 100,
        allocation_amount: optimal.weights[i] * budget
    })).filter(a => a.allocation_percentage > 0.01); // Filter minimal allocations

    return {
        strategy_id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        config,
        total_npv: optimal.metrics.npv,
        weighted_irr: optimal.metrics.irr,
        portfolio_volatility: optimal.metrics.volatility,
        portfolio_carbon_intensity: optimal.metrics.carbonIntensity,
        total_capex: budget, // Assumed fully allocated
        reserve_replacement_ratio: 1.2, // Mocked derived metric
        var_95: optimal.metrics.volatility * 1.645 * budget, // Parametric VaR
        liquidity_runway: optimal.metrics.liquidityRunway,
        efficient_frontier: frontierPoints,
        optimal_allocation: optimalAllocation,
        status: validResults.length > 0 ? 'OPTIMAL' : (results.length > 0 ? 'FEASIBLE' : 'INFEASIBLE')
    };
}
