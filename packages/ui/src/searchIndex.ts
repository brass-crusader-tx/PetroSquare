export interface SearchItem {
  id: string;
  title: string;
  type: 'MODULE' | 'METRIC' | 'BASIN' | 'LAYER' | 'PAGE';
  subtitle?: string;
  href: string;
  keywords: string[];
}

export const SEARCH_INDEX: SearchItem[] = [
    // Modules
    { id: 'mod-control', title: 'Control Center', type: 'MODULE', subtitle: 'Main Dashboard', href: '/', keywords: ['home', 'dashboard', 'main', 'kpi'] },
    { id: 'mod-prod', title: 'Production & Reserves', type: 'MODULE', subtitle: 'Basin aggregates & decline curves', href: '/modules/production', keywords: ['oil', 'gas', 'production', 'reserves', 'dca', 'volume'] },
    { id: 'mod-markets', title: 'Market Analytics', type: 'MODULE', subtitle: 'Pricing, spreads & futures', href: '/modules/markets', keywords: ['price', 'wti', 'brent', 'henry', 'hub', 'spread', 'crack'] },
    { id: 'mod-econ', title: 'Economics & Cost', type: 'MODULE', subtitle: 'Cash flow & NPV modeling', href: '/modules/economics', keywords: ['money', 'cost', 'capex', 'opex', 'npv', 'irr', 'tax'] },
    { id: 'mod-gis', title: 'GIS & Asset Intelligence', type: 'MODULE', subtitle: 'Maps, wells & pipelines', href: '/modules/gis', keywords: ['map', 'location', 'gps', 'spatial', 'asset'] },
    { id: 'mod-risk', title: 'Risk & Regulatory', type: 'MODULE', subtitle: 'Compliance & environmental', href: '/modules/risk', keywords: ['compliance', 'safety', 'env', 'esg', 'alert'] },
    { id: 'mod-intel', title: 'Market Intelligence', type: 'MODULE', subtitle: 'News & deals', href: '/modules/intel', keywords: ['news', 'merger', 'acquisition', 'competitor'] },

    // Pages
    { id: 'page-cap', title: 'Platform Capabilities', type: 'PAGE', subtitle: 'System features', href: '/capabilities', keywords: ['feature', 'help'] },
    { id: 'page-arch', title: 'System Architecture', type: 'PAGE', subtitle: 'Technical design', href: '/architecture', keywords: ['tech', 'stack', 'cloud'] },
    { id: 'page-contract', title: 'Contracts API', type: 'PAGE', subtitle: 'Developer documentation', href: '/contracts', keywords: ['api', 'dev', 'sdk'] },

    // Basins
    { id: 'basin-permian', title: 'Permian Basin', type: 'BASIN', subtitle: 'West Texas / New Mexico', href: '/modules/gis?basin=b-permian', keywords: ['permian', 'midland', 'delaware', 'texas'] },
    { id: 'basin-wcsb', title: 'WCSB', type: 'BASIN', subtitle: 'Western Canada Sedimentary Basin', href: '/modules/gis?basin=b-wcsb', keywords: ['canada', 'alberta', 'montney', 'duvernay'] },
    { id: 'basin-bakken', title: 'Bakken', type: 'BASIN', subtitle: 'North Dakota / Montana', href: '/modules/gis?basin=b-bakken', keywords: ['williston', 'dakota'] },
    { id: 'basin-eagleford', title: 'Eagle Ford', type: 'BASIN', subtitle: 'South Texas', href: '/modules/gis?basin=b-eagleford', keywords: ['eagle', 'ford', 'shale'] },

    // Metrics
    { id: 'metric-wti', title: 'WTI Crude', type: 'METRIC', subtitle: 'Benchmark Price', href: '/modules/markets?metric=wti', keywords: ['oil', 'price', 'crude'] },
    { id: 'metric-brent', title: 'Brent Crude', type: 'METRIC', subtitle: 'Benchmark Price', href: '/modules/markets?metric=brent', keywords: ['oil', 'price', 'crude', 'global'] },
    { id: 'metric-hh', title: 'Henry Hub', type: 'METRIC', subtitle: 'Natural Gas Benchmark', href: '/modules/markets?metric=hh', keywords: ['gas', 'price', 'ng'] },
    { id: 'metric-rigs', title: 'Active Rig Count', type: 'METRIC', subtitle: 'Drilling Activity', href: '/modules/production?metric=rigs', keywords: ['drill', 'rig', 'baker', 'hughes'] },

    // Layers
    { id: 'layer-wells', title: 'Well Locations', type: 'LAYER', subtitle: 'GIS Layer', href: '/modules/gis?layer=wells', keywords: ['well', 'hole', 'location'] },
    { id: 'layer-pipes', title: 'Pipelines', type: 'LAYER', subtitle: 'Infrastructure Map', href: '/modules/gis?layer=pipelines', keywords: ['pipe', 'transport', 'midstream'] },
];
