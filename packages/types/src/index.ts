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

/**
 * API Health Response
 */
export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  environment: string;
}

/**
 * API Meta Response
 */
export interface MetaResponse {
  version: string;
  buildId: string;
  commit: string;
  region?: string;
}

/**
 * Platform Domain
 */
export type PlatformDomain =
  | 'PRODUCTION'
  | 'MARKET'
  | 'GIS'
  | 'COST'
  | 'RISK'
  | 'INTELLIGENCE';

/**
 * Platform Layer
 */
export type PlatformLayer =
  | 'PRESENTATION'
  | 'API_INTEGRATION'
  | 'PROCESSING_ANALYTICS'
  | 'DATA_STORAGE_MANAGEMENT'
  | 'AI_ML'
  | 'SECURITY_COMPLIANCE';

/**
 * API Capabilities Response
 */
export interface CapabilitiesResponse {
  domains: PlatformDomain[];
  layers: PlatformLayer[];
  modules: string[];
  features: {
    aiReady: boolean;
    analyticsReady: boolean;
    realtimeReady: boolean;
  };
}
