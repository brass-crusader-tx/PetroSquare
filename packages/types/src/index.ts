/**
 * Canonical domain type for a physical asset (e.g., well, pump, facility).
 */
export interface Asset {
  id: string;
  name: string;
  type: 'WELL' | 'PUMP' | 'FACILITY' | 'PIPELINE';
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  latitude: number;
  longitude: number;
  metadata?: Record<string, unknown>;
}

/**
 * Canonical domain type for a Well.
 */
export interface Well extends Asset {
  type: 'WELL';
  depth: number;
  apiNumber: string; // American Petroleum Institute number
}

/**
 * User role definitions based on the architecture.
 */
export type UserRole =
  | 'PETROLEUM_ENGINEER'
  | 'PRODUCTION_ANALYST'
  | 'MARKET_ANALYST'
  | 'FINANCIAL_CONTROLLER'
  | 'DATA_SCIENTIST'
  | 'EXECUTIVE'
  | 'COMPLIANCE_OFFICER';

/**
 * Canonical domain type for a User.
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
  };
}

// --- Platform Contract Types ---

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
}

export interface MetaResponse {
  version: string;
  commit: string;
  environment: string;
  timestamp: string;
  transform_version?: string;
}

export type CapabilityStatus = 'live' | 'declared' | 'beta';

export interface Capability {
  id: string;
  title: string;
  description: string;
  status: CapabilityStatus;
  href: string;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  status: 'declared' | 'connected';
  inputs: string[];
  outputs: string[];
  assumptions: string[];
}

// --- Production & Reserves Types ---

export type RegionKind = 'US_STATE' | 'CA_PROVINCE';

export interface RegionRef {
  kind: RegionKind;
  code: string;
  name: string;
}

export interface TimeSeriesPoint {
  period: string; // ISO month (YYYY-MM) or year (YYYY)
  value: number;
}

export interface Provenance {
  source_name: string;
  source_url: string;
  retrieved_at: string;
  units?: string; // Sometimes units are part of provenance or top level
  notes?: string;
  cache_policy?: string;
  request_fingerprint?: string;
}

export interface ProductionSeriesResponse {
  region: RegionRef;
  commodity: 'CRUDE_OIL';
  series: TimeSeriesPoint[];
  units: string;
  frequency: string;
  provenance: Provenance;
}

export interface ReservesSeriesResponse {
  region: RegionRef;
  commodity: 'CRUDE_OIL';
  series: TimeSeriesPoint[];
  units: string;
  frequency: string;
  provenance: Provenance;
}

export interface TopProducerRow {
  region: RegionRef;
  latest_period: string;
  latest_value: number;
  units: string;
  rank?: number; // Added rank field for UI
}

export interface TopProducersResponse {
  kind: RegionKind;
  commodity: 'CRUDE_OIL';
  latest_period: string; // The period for which ranking is done
  units: string;
  rows: TopProducerRow[];
  provenance: Provenance;
}

export interface DataEnvelope<T> {
  status: 'ok' | 'degraded';
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  provenance?: Provenance;
}

// --- GIS & Asset Intelligence Types ---

export type ReserveClass = 'P1' | 'P2' | 'P3';
export type RegulatoryStatus = 'COMPLIANT' | 'WARNING' | 'VIOLATION';
export type AssetRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [longitude, latitude]
}

export type Geometry = GeoPoint | GeoPolygon;

/**
 * Enhanced Asset Model for GIS Module.
 * Extends the base Asset with financial, risk, and production metrics.
 */
export interface GISAsset extends Asset {
  operator_id: string;
  basin_id: string;
  jurisdiction_id: string;
  geometry: Geometry; // More precise geometry than just lat/long

  // Production & Reserves
  production_profile_id?: string;
  current_production?: number; // bbl/d
  reserve_class?: ReserveClass;

  // Economics
  breakeven_price?: number; // USD/bbl
  roi?: number; // percentage

  // Risk & Compliance
  carbon_intensity?: number; // kgCO2e/bbl
  regulatory_status?: RegulatoryStatus;
  risk_score?: number; // 0-100
  risk_level?: AssetRiskLevel;

  // Infrastructure Advantage
  infra_distance_pipeline?: number; // km
  infra_distance_refinery?: number; // km
}

export interface Basin {
  id: string;
  name: string;
  code: string;
  geometry: Geometry;
  center: [number, number]; // [lat, lng]
  description?: string;
  metrics: {
    total_production: number; // bbl/d
    active_rig_count: number;
    avg_breakeven: number; // USD
  };
}

export type OverlayType = 'INFRASTRUCTURE' | 'HEATMAP_ECONOMICS' | 'HEATMAP_CARBON' | 'REGULATORY_BOUNDARIES';

export interface MapOverlay {
  id: string;
  name: string;
  type: OverlayType;
  visible: boolean;
  opacity: number;
  legend?: { label: string; color: string; value?: string }[];
  data_endpoint?: string; // URL to fetch GeoJSON or Tile layer
}

export interface AISummary {
  context_id: string; // basin_id or asset_id
  context_type: 'BASIN' | 'ASSET';
  summary_markdown: string;
  confidence_score: number; // 0-1
  generated_at: string;
  model_version: string;
  sources: string[];
}

// --- Markets & Trading Types ---

export interface MarketBenchmark {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  currency: string;
  unit: string;
  last_updated: string;
}

export interface FuturesCurvePoint {
  month: string; // MMM-YY
  price: number;
}

export interface FuturesCurve {
  symbol: string;
  name: string;
  points: FuturesCurvePoint[];
  last_updated: string; // Keep for backward compat, but use asOf in new types
  asOf?: string; // Add optional asOf for compatibility
}

export interface CrackSpread {
  name: string;
  components: string[]; // e.g. ["WTI", "Gasoline", "Diesel"]
  value: number; // Spread value
  unit: string;
  trend: 'up' | 'down' | 'flat';
}

export interface MarketSummary {
  benchmarks: MarketBenchmark[];
  top_movers: MarketBenchmark[];
  pulse_summary: string; // AI generated text
}

// --- Economics Types ---

export interface EconScenario {
  id: string;
  name: string;
  created_at: string;
  inputs: {
    oil_price_base: number;
    opex_per_bbl: number;
    capex_initial: number;
    royalty_rate: number; // percentage
    discount_rate: number; // percentage
  };
}

export interface EconResult {
  scenario_id: string;
  npv: number;
  irr: number;
  payback_period: number; // years
  breakeven_oil_price: number;
  cash_flow_series: TimeSeriesPoint[];
}

export interface PortfolioItem {
  asset_id: string;
  asset_name: string;
  npv: number;
  roi: number;
  status: 'positive' | 'negative' | 'neutral';
}

// --- Market Intelligence Types ---

export interface IntelDeal {
  id: string;
  buyer: string;
  seller: string;
  value_usd_m: number;
  asset_type: string;
  date: string;
  description: string;
}

export interface IntelInfrastructure {
  id: string;
  name: string;
  type: 'PIPELINE' | 'TERMINAL' | 'REFINERY';
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'PLANNED';
  capacity: number;
  unit: string;
  location: string;
}

export interface IntelRigCount {
  region: string;
  count: number;
  change_weekly: number;
  date: string;
}

// --- Risk & Regulatory Types ---

export interface RiskEvent {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  date: string;
  source: string;
  description: string;
  affected_regions: string[];
}

export interface RiskAlert {
  id: string;
  type: 'POLITICAL' | 'ENVIRONMENTAL' | 'REGULATORY';
  message: string;
  asset_ids: string[];
  timestamp: string;
  acknowledged: boolean;
}

// --- Control Center Types ---

export interface TelemetryPoint {
  timestamp: string;
  value: number;
  unit: string;
  tag: string;
  quality: 'GOOD' | 'BAD' | 'UNCERTAIN';
}

export interface ControlAsset extends Asset {
  healthScore: number; // 0-100
  lastContact: string;
  activeAlarms: number;
  telemetry?: TelemetryPoint[]; // Latest snapshot
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  assetId: string;
  assetName: string;
  timestamp: string;
  assigneeId?: string;
  type: 'THRESHOLD' | 'ANOMALY' | 'SYSTEM';
  description: string;
}

export interface WorkflowStep {
  id: string;
  action: string;
  targetId?: string;
  params?: Record<string, unknown>;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export type WorkflowStatus = 'DRAFT' | 'SIMULATING' | 'COMMITTED' | 'FAILED';

export interface Workflow {
  id: string;
  title: string;
  description?: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: string;
  createdBy: string;
  simulatedImpact?: {
    riskScoreChange: number;
    costEstimate: number;
    timeline: string;
  };
}

export interface WorkflowDraft {
  title: string;
  description?: string;
  sourceAlertId?: string;
  sourceAssetId?: string;
}

export interface AuditEvent {
  id: string;
  eventType: 'ACK_ALERT' | 'ASSIGN_ALERT' | 'CREATE_WORKFLOW' | 'COMMIT_WORKFLOW' | 'LOGIN' | 'SYSTEM_CHANGE';
  timestamp: string;
  actorId: string;
  details: Record<string, unknown>;
  correlationId?: string; // Links related events (e.g. alert -> workflow -> commit)
}

export interface ControlCenterAssistSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ControlCenterAssistResponse {
  answer: string;
  confidence: number;
  sources: ControlCenterAssistSource[];
}

// --- Production & Reserves Types (Enhanced) ---

export interface ProductionSeries {
  asset_id: string;
  series_id: string;
  timestamp: string;
  value: number;
  measurement: 'OIL_RATE' | 'GAS_RATE' | 'WATER_RATE' | 'PRESSURE';
  unit: string;
  source_system: string;
  ingested_at: string;
  quality_flags: string[];
  tags: Record<string, string>;
}

export interface DcaModel {
  id: string;
  asset_id: string;
  type: 'EXPONENTIAL' | 'HYPERBOLIC';
  params: {
    qi: number; // Initial rate
    di: number; // Initial decline rate
    b?: number; // Hyperbolic exponent
  };
  goodness_of_fit: {
    r2: number;
    rmse: number;
  };
  created_at: string;
}

export interface Forecast {
  asset_id: string;
  model_id: string;
  scenario_id?: string;
  data: TimeSeriesPoint[];
  p10?: TimeSeriesPoint[];
  p50?: TimeSeriesPoint[];
  p90?: TimeSeriesPoint[];
  generated_at: string;
}

export interface Scenario {
  id: string;
  name: string;
  base_scenario_id?: string;
  asset_id: string;
  modifications: {
    decline_rate_multiplier?: number;
    downtime_days?: string[]; // ISO dates
    curtailment_percent?: number;
    uplift_multiplier?: number;
  };
  is_committed: boolean;
  created_at: string;
  created_by: string;
}

export interface Anomaly {
  id: string;
  asset_id: string;
  series_id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  type: 'SPIKE' | 'DROP' | 'FLATLINE';
  explanation: string;
  created_at: string;
}

export interface JobStatus {
  id: string;
  type: 'MONTE_CARLO' | 'INGESTION';
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number; // 0-100
  result?: unknown;
  error?: string;
  created_at: string;
  updated_at: string;
}

// --- Markets & Trading Analytics - Blueprint Types ---

export interface Instrument {
    id: string;
    type: 'CRUDE' | 'NATGAS' | 'POWER' | 'REFINED' | 'EMISSIONS' | 'EQUITY' | 'FX';
    symbol: string;
    exchange_symbol?: string;
    name: string;
    region: string;
    unit: string;
    currency: string;
    timezone: string;
}

export interface PricePoint {
    instrumentId: string;
    ts: string;
    price: number;
    unit: string;
    currency: string;
    source: string;
    qualityFlags: string[];
}

export interface PriceSeries {
    instrumentId: string;
    granularity: 'TICK' | '1M' | '1H' | '1D';
    points: PricePoint[];
}

export interface ForwardCurvePoint {
    instrumentId: string;
    deliveryStart: string;
    deliveryEnd: string;
    price: number;
    unit: string;
    currency: string;
    asOf: string;
}

export interface ForwardCurve {
    instrumentId: string;
    asOf: string;
    points: ForwardCurvePoint[];
}

export interface Position {
    id: string;
    book: string;
    strategy: string;
    instrumentId: string;
    type: 'PHYSICAL' | 'FINANCIAL';
    qty: number;
    unit: string;
    avgPrice: number;
    currency: string;
    start: string;
    end: string;
    tags: string[];
}

export interface HedgeLink {
    id: string;
    physicalPositionId: string;
    hedgePositionId: string;
    hedgeRatio: number;
    rationale: string;
    createdBy: string;
    createdAt: string;
}

export interface ProvenanceRef {
    sourceSystem: string;
    sourceType: 'EXCHANGE' | 'VENDOR' | 'INTERNAL' | 'NEWS';
    sourceRef?: string;
    ingestedAt: string;
    asOf: string;
    transformVersion?: string;
    checksum?: string;
    notes?: string;
}

export interface ConfidenceInterval {
    low: number;
    mid: number;
    high: number;
    level: number; // 0.95 etc
}

export interface AnalyticsResultEnvelope<T> {
    id: string;
    kind: 'SPREAD' | 'ARBITRAGE' | 'VAR' | 'CVAR' | 'GREEKS' | 'PRICING' | 'STRESS' | 'ESG' | 'SIGNAL';
    asOf: string;
    unit?: string;
    value: T;
    status: 'OK' | 'DEGRADED' | 'PENDING' | 'FAILED';
    confidenceInterval?: ConfidenceInterval | null;
    provenance: ProvenanceRef[];
    warnings?: string[];
}

export interface ScenarioRun {
    id: string;
    userId: string;
    createdAt: string;
    mode: 'SANDBOX' | 'LIVE';
    inputs: Record<string, unknown>;
    inputsHash: string;
    status: 'QUEUED' | 'RUNNING' | 'COMPLETE' | 'FAILED';
    outputs?: AnalyticsResultEnvelope<unknown>[];
}

export interface EmissionFactor {
    commodity: string;
    process: string;
    region: string;
    factor: number;
    unit: string; // e.g. kgCO2e/bbl
    source: string;
    effectiveDate: string;
}

export interface CarbonPriceSeries {
    region: string;
    price: number;
    unit: string;
    currency: string;
    asOf: string;
}

export interface MarketEvent {
    id: string;
    ts: string;
    title: string;
    summary: string;
    regions: string[];
    commodities: string[];
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    tags: string[];
    source: string;
    urlRef?: string;
    provenance?: ProvenanceRef;
    impact?: {
        instrumentIds: string[];
        description: string;
        confidence: number;
    };
}

// --- Intel Module Types ---

export type IntelItemType = 'NOTE' | 'LINK' | 'REPORT';
export type IntelItemStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type IntelEntityType = 'COMPANY' | 'ASSET' | 'BASIN' | 'PERSON' | 'COMMODITY';

export interface IntelTag {
  id: string;
  org_id: string;
  name: string;
  color?: string;
}

export interface IntelEntity {
  id: string;
  org_id: string;
  type: IntelEntityType;
  name: string;
  external_refs?: Record<string, string>;
  created_at: string;
}

export interface IntelReview {
  id: string;
  item_id: string;
  reviewer_id: string;
  status: 'APPROVED' | 'REJECTED';
  comments?: string;
  created_at: string;
}

export interface IntelItem {
  id: string;
  org_id: string;
  type: IntelItemType;
  title: string;
  content_text: string;
  source_url?: string;
  source_name?: string;
  author_id: string;
  status: IntelItemStatus;
  entities: IntelEntity[];
  tags: IntelTag[];
  reviews: IntelReview[];
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IntelCollection {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  filters: Record<string, unknown>;
  created_by: string;
  created_at: string;
}

export interface IntelSignalRule {
  field: 'title' | 'content' | 'source' | 'tag' | 'entity';
  operator: 'contains' | 'equals' | 'starts_with';
  value: string;
}

export interface IntelSignal {
  id: string;
  org_id: string;
  name: string;
  rules: IntelSignalRule[];
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntelSignalEvent {
  id: string;
  signal_id: string;
  signal_name: string;
  item_id: string;
  item_title: string;
  matched_rules: IntelSignalRule[];
  created_at: string;
}

// --- Portfolio Strategy & Capital Allocation Types ---

export interface PortfolioScenarioInput {
  oil_price_adjustment: number; // Percentage change (e.g. -20 for -20%)
  gas_price_adjustment: number;
  carbon_tax: number; // Absolute value USD/tonne
  production_outage: number; // Percentage volume reduction
  opex_inflation: number; // Percentage increase
  capex_inflation: number; // Percentage increase
  fiscal_regime_change: boolean;
}

export interface PortfolioConstraint {
  max_capital_budget: number; // USD
  min_liquidity: number; // USD
  max_volatility: number; // Percentage (std dev)
  max_carbon_intensity: number; // kgCO2e/boe
  min_irr: number; // Percentage
  mandatory_asset_ids: string[]; // Assets that cannot be divested
}

export interface OptimizationConfig {
  constraints: PortfolioConstraint;
  objective: 'MAX_NPV' | 'MAX_IRR' | 'MIN_VOLATILITY' | 'MIN_CARBON' | 'BALANCED';
  scenario: PortfolioScenarioInput;
  num_simulations?: number;
}

export interface PortfolioAsset {
  id: string;
  name: string;
  type: 'CONVENTIONAL' | 'SHALE' | 'OFFSHORE' | 'RENEWABLE';
  region: string;
  country: string;

  // Base Metrics
  base_npv: number;
  base_irr: number;
  base_volatility: number;
  base_carbon_intensity: number; // kgCO2e/boe
  liquidity_impact: number; // Days to liquidate or cost to exit

  // Scenario Metrics (dynamic)
  scenario_npv?: number;
  scenario_irr?: number;

  // Scoring
  risk_score: number; // 0-100 (100 = High Risk)
  composite_score: number; // 0-100 (100 = Best Asset)
  rank_change: 'UP' | 'DOWN' | 'SAME';
}

export interface EfficientFrontierPoint {
  risk: number; // Volatility (std dev)
  return: number; // NPV or IRR
  sharpe_ratio: number;
  allocation_id: string; // Link to specific allocation details
}

export interface CapitalAllocation {
  asset_id: string;
  allocation_amount: number; // USD
  allocation_percentage: number; // 0-100
}

export interface OptimizationResult {
  strategy_id: string;
  timestamp: string;
  config: OptimizationConfig;

  // Portfolio Level Metrics
  total_npv: number;
  weighted_irr: number;
  portfolio_volatility: number;
  total_capex: number;
  reserve_replacement_ratio: number;
  portfolio_carbon_intensity: number;
  var_95: number; // Value at Risk
  liquidity_runway: number; // Months

  efficient_frontier: EfficientFrontierPoint[];
  optimal_allocation: CapitalAllocation[];

  status: 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE';
}

export interface PortfolioStrategy {
  id: string;
  name: string;
  version: number;
  author_id: string;
  created_at: string;
  status: 'DRAFT' | 'STAGED' | 'APPROVED' | 'ARCHIVED';
  result: OptimizationResult;
  parent_strategy_id?: string;
  approval_trail?: {
    user_id: string;
    action: 'APPROVE' | 'REJECT';
    timestamp: string;
    comment?: string;
  }[];
}

export interface PortfolioDashboardData {
  current_strategy: PortfolioStrategy;
  scenarios: PortfolioScenarioInput[];
  assets: PortfolioAsset[];
  alerts: number; // Count of strategic alerts
}
