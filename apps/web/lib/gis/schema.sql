-- PetroSquare GIS & Asset Intelligence Schema
-- Designed for PostGIS + TimescaleDB

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- 1. Reference Tables (Enums & Dimensions)

CREATE TYPE asset_type AS ENUM ('WELL', 'FACILITY', 'PIPELINE', 'REFINERY');
CREATE TYPE asset_status AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'ABANDONED');
CREATE TYPE reserve_class AS ENUM ('P1', 'P2', 'P3');
CREATE TYPE regulatory_status AS ENUM ('COMPLIANT', 'WARNING', 'VIOLATION');

CREATE TABLE basins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    geometry GEOMETRY(POLYGON, 4326) NOT NULL, -- WGS84
    center_lat FLOAT NOT NULL,
    center_lng FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    ticker_symbol VARCHAR(10),
    headquarters_country VARCHAR(2) -- ISO code
);

-- 2. Asset Catalog (Spatial Index)

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255), -- e.g. API Number for Wells
    name VARCHAR(255) NOT NULL,
    type asset_type NOT NULL,
    status asset_status DEFAULT 'ACTIVE',

    basin_id UUID REFERENCES basins(id),
    operator_id UUID REFERENCES operators(id),
    jurisdiction_id VARCHAR(50), -- e.g. 'US-TX'

    location GEOMETRY(GEOMETRY, 4326) NOT NULL, -- Can be Point or LineString (Pipeline)

    -- Economic Attributes
    breakeven_price NUMERIC(10, 2), -- USD
    irr_percent NUMERIC(5, 2),

    -- Risk Attributes
    risk_score INT CHECK (risk_score BETWEEN 0 AND 100),
    carbon_intensity NUMERIC(10, 2), -- kgCO2e/bbl
    regulatory_status regulatory_status DEFAULT 'COMPLIANT',

    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assets_location ON assets USING GIST (location);
CREATE INDEX idx_assets_basin ON assets(basin_id);
CREATE INDEX idx_assets_operator ON assets(operator_id);

-- 3. Production Time-Series (Hypertable)

CREATE TABLE production_metrics (
    time TIMESTAMPTZ NOT NULL,
    asset_id UUID REFERENCES assets(id),

    oil_volume NUMERIC(12, 2), -- bbl
    gas_volume NUMERIC(12, 2), -- mcf
    water_volume NUMERIC(12, 2), -- bbl

    pressure_tubing NUMERIC(10, 2), -- psi
    pressure_casing NUMERIC(10, 2), -- psi

    UNIQUE (time, asset_id)
);

-- Convert to TimescaleDB Hypertable
SELECT create_hypertable('production_metrics', 'time');

-- 4. Infrastructure & Overlays

CREATE TABLE infrastructure_overlays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'PIPELINE', 'POWER_GRID', etc.
    geometry GEOMETRY(GEOMETRY, 4326) NOT NULL,
    properties JSONB
);

CREATE INDEX idx_infra_geometry ON infrastructure_overlays USING GIST (geometry);

-- 5. AI Summaries

CREATE TABLE ai_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_id UUID NOT NULL, -- asset_id or basin_id
    context_type VARCHAR(50) NOT NULL, -- 'ASSET' or 'BASIN'

    summary_markdown TEXT NOT NULL,
    confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
    model_version VARCHAR(50),
    sources TEXT[], -- Array of source identifiers

    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_context ON ai_summaries(context_id, generated_at DESC);
