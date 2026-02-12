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
  last_updated: string;
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
