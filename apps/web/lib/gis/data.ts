import { GISAsset, Basin, MapOverlay, AISummary } from '@petrosquare/types';

// --- Helper for random generation ---
function randomInRange(min: number, max: number, decimals: number = 2): number {
  const rand = Math.random() * (max - min) + min;
  return Number(rand.toFixed(decimals));
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Mock Basins ---
export const MOCK_BASINS: Basin[] = [
  {
    id: 'b-permian',
    name: 'Permian Basin',
    code: 'PERM',
    center: [31.9, -102.1], // Midland
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-103.5, 30.5], [-100.5, 30.5], [-100.5, 33.5], [-103.5, 33.5], [-103.5, 30.5]
      ]]
    }, // Simplified box
    description: "The Permian Basin is a sedimentary basin largely contained in the western part of Texas and the southeastern part of New Mexico.",
    metrics: {
      total_production: 5800000,
      active_rig_count: 305,
      avg_breakeven: 42.50
    }
  },
  {
    id: 'b-wcsb',
    name: 'Western Canadian Sedimentary Basin',
    code: 'WCSB',
    center: [55.2, -118.8], // Grande Prairie
    geometry: {
      type: 'Polygon',
      coordinates: [[
         [-122.0, 52.0], [-110.0, 52.0], [-110.0, 60.0], [-122.0, 60.0], [-122.0, 52.0]
      ]]
    },
    description: "A vast sedimentary basin underlying 1.4 million square kilometers of Western Canada.",
    metrics: {
        total_production: 4500000,
        active_rig_count: 180,
        avg_breakeven: 48.00
    }
  }
];

// --- Mock Assets ---
const OPERATORS = ['Chevron', 'ExxonMobil', 'Occidental', 'Pioneer', 'ConocoPhillips', 'EOG Resources', 'Devon Energy'];

const generateAssets = (count: number, basin: Basin, baseLat: number, baseLng: number): GISAsset[] => {
  return Array.from({ length: count }).map((_, i) => {
    const lat = randomInRange(baseLat - 0.5, baseLat + 0.5, 4);
    const lng = randomInRange(baseLng - 0.5, baseLng + 0.5, 4);
    const type = randomChoice(['WELL', 'WELL', 'WELL', 'FACILITY', 'PIPELINE'] as const);

    return {
      id: `${basin.code.toLowerCase()}-${type.toLowerCase()}-${i + 1}`,
      name: `${basin.code}-${type.substring(0, 1)}-${1000 + i}`,
      type,
      status: randomChoice(['ACTIVE', 'ACTIVE', 'ACTIVE', 'MAINTENANCE', 'INACTIVE']),
      latitude: lat,
      longitude: lng,
      operator_id: randomChoice(OPERATORS),
      basin_id: basin.id,
      jurisdiction_id: basin.code === 'PERM' ? 'US-TX' : 'CA-AB',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      production_profile_id: `prod-${i}`,
      current_production: type === 'WELL' ? randomInRange(100, 5000, 0) : undefined,
      reserve_class: randomChoice(['P1', 'P1', 'P2']),
      breakeven_price: randomInRange(30, 65),
      carbon_intensity: randomInRange(10, 50),
      risk_score: randomInRange(10, 90, 0),
      risk_level: randomChoice(['LOW', 'LOW', 'MEDIUM', 'MEDIUM', 'HIGH']),
      regulatory_status: randomChoice(['COMPLIANT', 'COMPLIANT', 'WARNING']),
      infra_distance_pipeline: randomInRange(0.5, 20),
      infra_distance_refinery: randomInRange(50, 300)
    };
  });
};

export const MOCK_ASSETS: GISAsset[] = [
  // Fixed asset at center for testing/demo reliability
  {
      id: 'b-permian-fixed-center',
      name: 'Permian Center Well',
      type: 'WELL',
      status: 'ACTIVE',
      latitude: 31.9,
      longitude: -102.1,
      operator_id: 'Test Operator',
      basin_id: 'b-permian',
      jurisdiction_id: 'US-TX',
      geometry: { type: 'Point', coordinates: [-102.1, 31.9] },
      production_profile_id: 'prod-fixed',
      current_production: 1000,
      reserve_class: 'P1',
      breakeven_price: 40,
      carbon_intensity: 20,
      risk_score: 10,
      risk_level: 'LOW',
      regulatory_status: 'COMPLIANT',
      infra_distance_pipeline: 1,
      infra_distance_refinery: 100,
      metadata: { note: 'Fixed verification asset' }
  },
  ...generateAssets(29, MOCK_BASINS[0], 31.9, -102.1), // Permian
  ...generateAssets(15, MOCK_BASINS[1], 55.2, -118.8)  // WCSB
];

// --- Mock Overlays ---
export const MOCK_OVERLAYS: MapOverlay[] = [
  {
    id: 'ov-infra',
    name: 'Infrastructure & Pipelines',
    type: 'INFRASTRUCTURE',
    visible: true,
    opacity: 1.0,
    legend: [
       { label: 'Oil Pipeline', color: '#10B981' }, // Green
       { label: 'Gas Pipeline', color: '#3B82F6' }, // Blue
       { label: 'Refinery', color: '#F59E0B' }      // Amber
    ]
  },
  {
    id: 'ov-econ',
    name: 'Economic Margin Heatmap',
    type: 'HEATMAP_ECONOMICS',
    visible: false,
    opacity: 0.6,
    legend: [
        { label: 'High Margin (>$30/bbl)', color: '#059669' },
        { label: 'Medium Margin', color: '#FCD34D' },
        { label: 'Low/Negative', color: '#EF4444' }
    ]
  },
  {
    id: 'ov-carbon',
    name: 'Carbon Intensity & CCUS',
    type: 'HEATMAP_CARBON',
    visible: false,
    opacity: 0.5,
    legend: [
        { label: 'Low Intensity', color: '#10B981' },
        { label: 'High Intensity', color: '#7F1D1D' }, // Dark Red
        { label: 'CCUS Site', color: '#6366F1' }        // Indigo
    ]
  }
];

// --- Mock AI Summaries ---
export const MOCK_SUMMARIES: Record<string, AISummary> = {
    'b-permian': {
        context_id: 'b-permian',
        context_type: 'BASIN',
        generated_at: new Date().toISOString(),
        model_version: 'PetroGPT-4-Turbo',
        sources: ['EIA DPR', 'TX RRC', 'Operator Filings'],
        confidence_score: 0.92,
        summary_markdown: `
**Permian Basin Executive Summary**

*   **Production Outlook**: Current output remains strong at **5.8 MMbbl/d**, driven by efficiency gains in the Midland sub-basin.
*   **Infrastructure**: Pipeline takeaway capacity is sufficient, but gas processing constraints are emerging near the Delaware basin edge.
*   **Economics**: Average breakeven has dropped to **$42.50/bbl** due to longer laterals and optimized completion designs.
*   **Risk**: Flaring regulations are tightening; operators with high carbon intensity (>25 kg/bbl) face regulatory headwinds.
        `
    },
    'b-wcsb': {
        context_id: 'b-wcsb',
        context_type: 'BASIN',
        generated_at: new Date().toISOString(),
        model_version: 'PetroGPT-4-Turbo',
        sources: ['CER Canada', 'Alberta Energy Regulator'],
        confidence_score: 0.88,
        summary_markdown: `
**WCSB Executive Summary**

*   **Production**: Steady growth in Montney condensate-rich windows.
*   **Infrastructure**: TMX expansion is expected to narrow the WCS differential significantly.
*   **Carbon**: CCUS projects in the Alberta Industrial Heartland are accelerating, offering carbon offset opportunities.
        `
    }
};
