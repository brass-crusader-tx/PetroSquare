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
