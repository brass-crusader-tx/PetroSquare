import {
  MarketBenchmark, FuturesCurve, CrackSpread, MarketSummary,
  ProductionSeriesResponse, ReservesSeriesResponse, TopProducersResponse,
  EconScenario, EconResult, PortfolioItem,
  IntelDeal, IntelInfrastructure, IntelRigCount,
  RiskEvent, RiskAlert, MapOverlay,
  RegionKind,
  TopProducerRow,
  PortfolioScenarioInput
} from '@petrosquare/types';
import { DATA_SOURCES } from './registry';
import { globalCache } from './cache';

// --- Helper Functions ---

function randomValue(base: number, volatility: number): number {
  return base + (Math.random() - 0.5) * volatility;
}

// --- Markets Connector ---

export const MarketsConnector = {
  async getBenchmarks(): Promise<MarketBenchmark[]> {
    return [
      { symbol: 'CL=F', name: 'WTI Crude', price: randomValue(75.50, 2.0), change: randomValue(0.5, 1.0), change_percent: 0.85, currency: 'USD', unit: 'bbl', last_updated: new Date().toISOString() },
      { symbol: 'BB=F', name: 'Brent Crude', price: randomValue(80.20, 2.0), change: randomValue(-0.2, 0.5), change_percent: -0.25, currency: 'USD', unit: 'bbl', last_updated: new Date().toISOString() },
      { symbol: 'NG=F', name: 'Natural Gas', price: randomValue(2.80, 0.5), change: randomValue(0.05, 0.1), change_percent: 1.8, currency: 'USD', unit: 'MMBtu', last_updated: new Date().toISOString() }
    ];
  },

  async getFuturesCurve(symbol: string): Promise<FuturesCurve> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const basePrice = symbol === 'CL=F' ? 75.0 : 80.0;

    return {
      symbol,
      name: symbol === 'CL=F' ? 'WTI Futures' : 'Brent Futures',
      last_updated: new Date().toISOString(),
      points: months.map((m, i) => ({
        month: `${m}-24`,
        price: basePrice - (i * 0.2) + (Math.random() * 0.5) // Slight backwardation
      }))
    };
  },

  async getCrackSpreads(): Promise<CrackSpread[]> {
    return [
      { name: '3:2:1 Gulf Coast', components: ['WTI', 'Gasoline', 'Diesel'], value: randomValue(22.5, 3.0), unit: 'USD/bbl', trend: 'up' },
      { name: 'NY Harbor Heat', components: ['Brent', 'Heating Oil'], value: randomValue(18.0, 2.0), unit: 'USD/bbl', trend: 'down' }
    ];
  },

  async getSummary(): Promise<MarketSummary> {
      const benchmarks = await this.getBenchmarks();
      return {
          benchmarks: benchmarks,
          top_movers: [benchmarks[0]],
          pulse_summary: "Oil prices remain volatile amidst geopolitical tensions in the Middle East. WTI is testing resistance at $76/bbl while natural gas sees a slight recovery due to colder forecasts."
      }
  }
};

// --- Production Connector ---

export const ProductionConnector = {
  async getForecast(scenario: PortfolioScenarioInput): Promise<any> {
       // Mock forecast data
       return {
           total_production: 1250000 * (1 - (scenario.production_outage || 0) / 100),
           unit: 'boe/d',
           forecast_series: Array.from({length: 12}).map((_, i) => ({
               period: `2024-${String(i+1).padStart(2, '0')}`,
               value: 1250000 * (1 - (scenario.production_outage || 0) / 100) * (1 - i * 0.02) // Decline
           }))
       };
  },

  async getRegions(country: 'US' | 'CA'): Promise<TopProducersResponse> {
    const kind: RegionKind = country === 'US' ? 'US_STATE' : 'CA_PROVINCE';
    const regions = country === 'US'
      ? [{ code: 'TX', name: 'Texas', val: 5500 }, { code: 'NM', name: 'New Mexico', val: 1800 }, { code: 'ND', name: 'North Dakota', val: 1100 }]
      : [{ code: 'AB', name: 'Alberta', val: 3800 }, { code: 'SK', name: 'Saskatchewan', val: 450 }, { code: 'NL', name: 'Newfoundland', val: 220 }];

    const rows: TopProducerRow[] = regions.map((r, i) => ({
      region: { kind, code: r.code, name: r.name },
      latest_period: '2023-12',
      latest_value: r.val * 1000, // bbl/d
      units: 'bbl/d',
      rank: i + 1
    }));

    return {
      kind,
      commodity: 'CRUDE_OIL',
      latest_period: '2023-12',
      units: 'bbl/d',
      rows,
      provenance: {
        source_name: DATA_SOURCES['petrosquare-demo'].name,
        source_url: DATA_SOURCES['petrosquare-demo'].url,
        retrieved_at: new Date().toISOString()
      }
    };
  },

  async getBasins(): Promise<any[]> {
     return [
         { name: 'Permian', production: 5800000, rigs: 305 },
         { name: 'Eagle Ford', production: 1100000, rigs: 55 },
         { name: 'Bakken', production: 1200000, rigs: 32 },
         { name: 'WCSB', production: 4500000, rigs: 180 }
     ]
  },

  async getWell(id: string): Promise<any> {
      return {
          id: id,
          name: `Well ${id}`,
          apiNumber: `42-000-${id}`,
          status: 'ACTIVE',
          basin: 'Permian',
          depth: 12500,
          operator: 'Pioneer',
          production_history: Array.from({length: 12}).map((_, i) => ({
              period: `2023-${String(i+1).padStart(2, '0')}`,
              oil: randomValue(800, 50),
              gas: randomValue(1200, 100),
              water: randomValue(200, 20)
          }))
      }
  },

  async getReservesSnapshot(): Promise<any> {
      return {
          total_1p: 1250, // MMbbl
          total_2p: 2100, // MMbbl
          total_3p: 3500, // MMbbl
          by_basin: [
              { basin: 'Permian', p1: 800, p2: 1200 },
              { basin: 'WCSB', p1: 450, p2: 900 }
          ],
          last_audit: '2023-12-31'
      }
  }
};

// --- Economics Connector ---

export const EconomicsConnector = {
  async runCustomScenario(inputs: PortfolioScenarioInput): Promise<PortfolioItem[]> {
      const basePortfolio = await this.getPortfolio();
      // Apply shocks
      return basePortfolio.map(item => {
          let npvImpact = 1.0;
          if (inputs.oil_price_adjustment !== 0) npvImpact += (inputs.oil_price_adjustment / 100) * 1.5; // Sensitivity
          if (inputs.carbon_tax > 0) npvImpact -= (inputs.carbon_tax / 100) * 0.1;
          if (inputs.production_outage > 0) npvImpact -= (inputs.production_outage / 100);

          return {
              ...item,
              npv: item.npv * npvImpact,
              roi: item.roi * npvImpact // Simplification
          };
      });
  },

  async getScenarios(): Promise<EconScenario[]> {
    return [
      {
        id: 'sc-base',
        name: 'Base Case 2024',
        created_at: new Date().toISOString(),
        inputs: { oil_price_base: 75, opex_per_bbl: 12, capex_initial: 5000000, royalty_rate: 12.5, discount_rate: 10 }
      },
      {
        id: 'sc-high',
        name: 'High Price / High Cost',
        created_at: new Date().toISOString(),
        inputs: { oil_price_base: 95, opex_per_bbl: 18, capex_initial: 6500000, royalty_rate: 12.5, discount_rate: 12 }
      }
    ];
  },

  async runScenario(id: string): Promise<EconResult> {
    // Deterministic mock calculation
    const scenario = (await this.getScenarios()).find(s => s.id === id);
    if (!scenario) throw new Error("Scenario not found");

    const cashFlows = Array.from({ length: 12 }).map((_, i) => ({
        period: `2024-${String(i+1).padStart(2, '0')}`,
        value: randomValue(100000, 20000)
    }));

    return {
      scenario_id: id,
      npv: scenario.inputs.oil_price_base * 100000 - scenario.inputs.capex_initial, // Dummy formula
      irr: 15 + (scenario.inputs.oil_price_base - 70), // Dummy formula
      payback_period: 2.5,
      breakeven_oil_price: 45.0,
      cash_flow_series: cashFlows
    };
  },

  async getPortfolio(): Promise<PortfolioItem[]> {
      return [
          { asset_id: 'p-1', asset_name: 'Permian Alpha', npv: 12500000, roi: 18.5, status: 'positive' },
          { asset_id: 'w-1', asset_name: 'WCSB Expansion', npv: 4500000, roi: 12.2, status: 'neutral' },
          { asset_id: 'g-1', asset_name: 'Gulf Coast Deepwater', npv: -2000000, roi: 5.5, status: 'negative' }
      ];
  }
};

// --- Intel Connector ---

export const IntelConnector = {
    async getDeals(): Promise<IntelDeal[]> {
        return [
            { id: 'd-1', buyer: 'Chevron', seller: 'Hess', value_usd_m: 53000, asset_type: 'Corporate', date: '2023-10-23', description: 'All-stock transaction to acquire Hess Corporation.' },
            { id: 'd-2', buyer: 'ExxonMobil', seller: 'Pioneer', value_usd_m: 59500, asset_type: 'Corporate', date: '2023-10-11', description: 'Merger to dominate Permian basin production.' }
        ];
    },

    async getInfrastructure(): Promise<IntelInfrastructure[]> {
        return [
            { id: 'inf-1', name: 'Keystone XL', type: 'PIPELINE', status: 'MAINTENANCE', capacity: 830000, unit: 'bbl/d', location: 'Hardisty, AB to Steele City, NE' },
            { id: 'inf-2', name: 'Corpus Christi Liquefaction', type: 'TERMINAL', status: 'OPERATIONAL', capacity: 15, unit: 'MTPA', location: 'Texas Gulf Coast' }
        ];
    },

    async getRigs(): Promise<IntelRigCount[]> {
        return [
            { region: 'Permian', count: 305, change_weekly: -2, date: new Date().toISOString() },
            { region: 'Eagle Ford', count: 55, change_weekly: 1, date: new Date().toISOString() },
            { region: 'Williston', count: 34, change_weekly: 0, date: new Date().toISOString() },
            { region: 'Canada', count: 180, change_weekly: 5, date: new Date().toISOString() }
        ];
    }
};

// --- Risk Connector ---

export const RiskConnector = {
    async getRiskMetrics(): Promise<Record<string, number>> {
      return {
          'p-1': 25,
          'w-1': 45,
          'g-1': 80
      };
    },

    async getEvents(): Promise<RiskEvent[]> {
        return [
            { id: 'evt-1', title: 'EPA Methane Rule Finalized', severity: 'HIGH', date: '2023-12-02', source: 'EPA Press Release', description: 'New standards for methane emissions from oil and gas operations.', affected_regions: ['US'] },
            { id: 'evt-2', title: 'OPEC+ Production Cuts', severity: 'MEDIUM', date: '2023-11-30', source: 'Reuters', description: 'Member nations agree to voluntary cuts totaling 2.2 mbpd.', affected_regions: ['Global'] }
        ];
    },

    async getOverlays(): Promise<MapOverlay[]> {
        return [
            { id: 'ov-sanctions', name: 'Sanctioned Entities', type: 'REGULATORY_BOUNDARIES', visible: true, opacity: 0.5 },
            { id: 'ov-emissions', name: 'Methane Plumes (Satellite)', type: 'HEATMAP_CARBON', visible: false, opacity: 0.7 }
        ];
    },

    async getAlerts(): Promise<RiskAlert[]> {
        return [
            { id: 'alt-1', type: 'REGULATORY', message: 'New venting regulations effective in Texas', asset_ids: ['permian-1', 'permian-2'], timestamp: new Date().toISOString(), acknowledged: false },
            { id: 'alt-2', type: 'ENVIRONMENTAL', message: 'High methane concentration detected near Field X', asset_ids: ['wcsb-5'], timestamp: new Date().toISOString(), acknowledged: false }
        ];
    }
};
