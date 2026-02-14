-- Production & Reserves Module Schema
-- Designed for PostGIS + TimescaleDB

-- 1. Production Series (Hypertable)

CREATE TYPE production_measurement AS ENUM ('OIL_RATE', 'GAS_RATE', 'WATER_RATE', 'PRESSURE_TUBING', 'PRESSURE_CASING');

CREATE TABLE production_series (
    time TIMESTAMPTZ NOT NULL,
    asset_id UUID REFERENCES assets(id),
    series_id VARCHAR(50) NOT NULL, -- e.g. "well-123-oil"

    measurement production_measurement NOT NULL,
    value NUMERIC(12, 4),
    unit VARCHAR(20),

    source_system VARCHAR(50),
    ingested_at TIMESTAMPTZ DEFAULT NOW(),

    quality_flags TEXT[], -- e.g. ['OUTLIER', 'MISSING_INTERPOLATED']
    tags JSONB DEFAULT '{}',

    UNIQUE (time, asset_id, measurement)
);

SELECT create_hypertable('production_series', 'time');

-- 2. DCA Models

CREATE TYPE dca_model_type AS ENUM ('EXPONENTIAL', 'HYPERBOLIC');

CREATE TABLE dca_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id),
    type dca_model_type NOT NULL,

    -- Parameters
    qi NUMERIC(12, 4) NOT NULL,
    di NUMERIC(12, 4) NOT NULL,
    b NUMERIC(5, 4), -- for hyperbolic

    -- Fit Quality
    r2 NUMERIC(5, 4),
    rmse NUMERIC(12, 4),

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scenarios

CREATE TABLE scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    base_scenario_id UUID REFERENCES scenarios(id),

    asset_id UUID REFERENCES assets(id),

    -- Modifications stored as JSON
    modifications JSONB, -- { decline_rate_multiplier: 1.1, downtime_days: [...] }

    is_committed BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(255), -- User ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Anomalies

CREATE TYPE anomaly_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE anomaly_type AS ENUM ('SPIKE', 'DROP', 'FLATLINE');

CREATE TABLE anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id),
    series_id VARCHAR(50),
    timestamp TIMESTAMPTZ NOT NULL,

    severity anomaly_severity NOT NULL,
    type anomaly_type NOT NULL,
    explanation TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Jobs (Monte Carlo / Ingestion)

CREATE TYPE job_type AS ENUM ('MONTE_CARLO', 'INGESTION');
CREATE TYPE job_status AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type job_type NOT NULL,
    status job_status DEFAULT 'QUEUED',

    progress INT DEFAULT 0,
    result JSONB,
    error TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
