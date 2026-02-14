-- PetroSquare Economics Schema

-- 1. Reference Tables (Enums & Dimensions)

CREATE TYPE scenario_status AS ENUM ('DRAFT', 'LOCKED', 'ARCHIVED');
CREATE TYPE run_status AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');
CREATE TYPE export_type AS ENUM ('CSV', 'JSON', 'PDF');

-- 2. Scenarios

CREATE TABLE economics_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status scenario_status DEFAULT 'DRAFT',

    tags TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scenarios_org ON economics_scenarios(org_id);
CREATE INDEX idx_scenarios_status ON economics_scenarios(status);

-- 3. Versions

CREATE TABLE economics_scenario_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID REFERENCES economics_scenarios(id) ON DELETE CASCADE,
    version INT NOT NULL,
    name VARCHAR(255), -- Optional user-friendly name for version
    description TEXT,

    input_payload_json JSONB NOT NULL, -- The full configuration for this version

    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(scenario_id, version)
);

CREATE INDEX idx_versions_scenario ON economics_scenario_versions(scenario_id);

-- 4. Runs

CREATE TABLE economics_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_version_id UUID REFERENCES economics_scenario_versions(id) ON DELETE CASCADE,

    status run_status DEFAULT 'QUEUED',
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    engine_version VARCHAR(50),

    result_payload_json JSONB, -- The calculated results (KPIs, cashflows)
    warnings_json JSONB, -- Array of warning messages
    error_json JSONB, -- Error details if failed

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_runs_version ON economics_runs(scenario_version_id);
CREATE INDEX idx_runs_status ON economics_runs(status);

-- 5. Exports

CREATE TABLE economics_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_version_id UUID REFERENCES economics_scenario_versions(id) ON DELETE CASCADE,
    run_id UUID REFERENCES economics_runs(id), -- Optional link to specific run

    type export_type NOT NULL,
    storage_ref VARCHAR(1024), -- URL or path to stored file

    created_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exports_version ON economics_exports(scenario_version_id);
