export enum ModeId {
  CONTROL_CENTER = 'CONTROL_CENTER',
  GIS_INTELLIGENCE = 'GIS_INTELLIGENCE',
  MARKET_INTELLIGENCE = 'MARKET_INTELLIGENCE',
  MARKETS_TRADING = 'MARKETS_TRADING',
  PRODUCTION_RESERVES = 'PRODUCTION_RESERVES',
  ECONOMICS = 'ECONOMICS',
  RISK_REGULATORY = 'RISK_REGULATORY',
}

export interface FocusTarget {
  regionId?: string;
  siteId?: string;
  assetId?: string;
  position?: [number, number, number];
}

export interface ActionPlan {
  focus?: FocusTarget;
  setMode?: ModeId;
  openContext?: {
    entityType: string;
    entityId: string;
    tab?: string;
    chartId?: string;
  };
  runSim?: {
    simType: string;
    params: Record<string, any>;
  };
  createProposal?: {
    type: string;
    targetId: string;
    description: string;
  };
}

export interface OsState {
  activeMode: ModeId;
  zoomLevel: number;
}
