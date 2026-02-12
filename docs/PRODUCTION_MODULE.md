# Production & Reserves Module

## Overview
The Production & Reserves module provides a comprehensive view of crude oil production and proved reserves for US States and Canadian Provinces. It is designed to be decision-centric, offering both detailed historical series and ranked "Top Producers" snapshots.

## Data Sources
The module aggregates data from authoritative government sources:

### United States (EIA)
- **Source**: U.S. Energy Information Administration (EIA) Open Data API (v2).
- **Datasets**:
    - Crude Oil Production by State (Monthly).
    - Proved Reserves of Crude Oil by State (Annual).
- **Update Frequency**: Monthly (Production), Annual (Reserves).

### Canada (CER)
- **Source**: Canada Energy Regulator (CER) Open Government.
- **Datasets**:
    - Estimated Monthly Production of Crude Oil and Equivalent by Province.
- **Update Frequency**: Monthly.
- **Note**: Proved reserves by province are **not available** via a stable public API currently. The system returns a specific `NOT_AVAILABLE` error code for CA reserves queries, which the UI handles gracefully.

## Architecture
The module follows the PetroSquare layered architecture:
1.  **UI Layer**: `apps/web/app/modules/production/page.tsx` - React/Next.js client components.
2.  **API Layer**: `apps/web/app/api/data/production-reserves/*` - Next.js Route Handlers.
    -   Handles caching, parameter validation, and response enveloping.
3.  **Connector Layer**: `packages/connectors` - Framework-agnostic logic.
    -   `eia`: Handles EIA API authentication and fetching.
    -   `cer`: Handles CSV fetching, parsing, and unit conversion.
4.  **Domain Types**: `packages/types` - Shared interfaces (`ProductionSeriesResponse`, `RegionRef`, etc.).

## Endpoints

### Regions
`GET /api/data/production-reserves/regions`
Returns a list of all supported US States and CA Provinces.

### Production
`GET /api/data/production-reserves/production?kind=[US_STATE|CA_PROVINCE]&code=[CODE]`
Returns monthly production time series.
- **Units**: MBBL/d (Thousand Barrels per Day).
- **Cache**: 6 hours.

### Reserves
`GET /api/data/production-reserves/reserves?kind=[US_STATE|CA_PROVINCE]&code=[CODE]`
Returns annual proved reserves.
- **Units**: MMbbl (Million Barrels).
- **Cache**: 7 days.
- **Note**: CA_PROVINCE returns `degraded` status.

### Top Producers
`GET /api/data/production-reserves/top-producers?kind=[US_STATE|CA_PROVINCE]&limit=[N]`
Returns a ranked list of regions based on the latest available production data.
- **Logic**:
    -   Fetches latest data for all regions (concurrency limited).
    -   Determines the "latest common period" based on majority reporting.
    -   Ranks by value descending.
- **Performance**: High caching (12 hours) to prevent upstream DoS.

## Adding New Regions
To add a new region or country:
1.  **Connector**: Implement a new submodule in `packages/connectors` (e.g., `src/norway`).
2.  **Types**: Update `RegionKind` in `packages/types`.
3.  **API**: Update `regions`, `production`, and `reserves` route handlers to route requests to the new connector.
4.  **UI**: The UI automatically consumes the updated `regions` list.

## Known Limitations
-   **CA Reserves**: Placeholder implementation until CER publishes a stable reserves dataset.
-   **Top Producers**: Ranking is based on the latest available month for the majority of reporters. If a single region is significantly delayed, it may be excluded from the "latest" snapshot or shown with older data depending on the period selection logic.
