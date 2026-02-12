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

// --- Data & Connector Contracts ---

export type DataHealthStatus = 'ok' | 'degraded' | 'maintenance';

export interface Provenance {
  source_name: string;
  source_url: string;
  retrieved_at: string; // ISO timestamp
  units: string;
  notes?: string;
  assumptions?: string;
  cache_policy?: string; // e.g. "revalidate: 300s"
}

export interface ApiResponse<T> {
  data: T | null;
  status: DataHealthStatus;
  error?: string;
  provenance?: Provenance;
}

export interface MarketBenchmarkResponse {
  wti_price: number | null;
  brent_price: number | null;
  unit: string; // "USD/bbl"
  last_updated: string; // ISO timestamp from source
}

export interface InventorySeriesResponse {
  series: Array<{
    date: string;
    value: number;
  }>;
  unit: string; // "Mbbl" or similar
}

export interface WeatherSnapshotResponse {
  temperature: number;
  wind_speed: number;
  conditions: string;
  location: string;
  unit_system: 'metric' | 'imperial';
}

export interface FilingFeedResponse {
  filings: Array<{
    company: string;
    ticker: string;
    form_type: string;
    filed_at: string; // ISO
    link: string;
  }>;
}
