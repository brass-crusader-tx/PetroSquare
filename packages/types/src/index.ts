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

// --- Data & Connector Types ---

export interface Provenance {
  sourceName: string;
  sourceUrl: string;
  retrievedAt: string;
  license?: string;
}

export interface DataPoint {
  value: number;
  unit: string;
  timestamp: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  unit: string;
  currency: string;
  provenance: Provenance;
}

export interface WeatherContext {
  location: string;
  temperature: number;
  unit: 'F' | 'C';
  condition: string;
  windSpeed: number;
  windDirection: string; // Cardinal direction (N, NE, etc.) or degrees
  provenance: Provenance;
}

export interface ConnectorStatus {
  id: string;
  name: string;
  status: 'ok' | 'error' | 'maintenance';
  lastSuccess?: string;
  message?: string;
}
