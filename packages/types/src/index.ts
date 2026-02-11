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
 * System Health Status
 */
export interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  env: string;
}

/**
 * System Metadata
 */
export interface SystemMeta {
  version: string;
  build: string;
  commit: string;
  region: string;
}

/**
 * Module Capability Definition
 */
export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'beta' | 'deprecated' | 'planned';
  path: string;
  category: 'upstream' | 'midstream' | 'downstream' | 'finance' | 'esg';
}

/**
 * Capability Layer Definition
 */
export interface CapabilityLayer {
  name: string;
  description: string;
  modules: ModuleDefinition[];
}

/**
 * Overall System Capabilities
 */
export interface Capability {
  domain: string;
  layers: CapabilityLayer[];
}
