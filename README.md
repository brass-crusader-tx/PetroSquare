# PetroSquare Platform

PetroSquare is a vendor-neutral digital operating system for oil and gas enterprises.

## Architecture

*   **Monorepo**: Managed with `pnpm` workspaces.
*   **Web**: Next.js 14 App Router, Tailwind CSS, TypeScript.
*   **API**: Serverless functions (Next.js API Routes).
*   **Data Fabric**: Unified data access layer with connectors, caching, and normalization.
*   **Design System**: Shared UI components in `@petrosquare/ui`.

## Modules

The platform is organized into domain-specific modules:

1.  **Markets & Trading**: Real-time benchmarks, futures curves, crack spreads (`/modules/markets`).
2.  **Production & Reserves**: Production by region (US/CA), basin analytics, well drilldown (`/modules/production`).
3.  **Cost & Economics**: Scenario modeling (NPV, IRR), portfolio analysis (`/modules/economics`).
4.  **GIS & Asset Intelligence**: interactive map, asset details, risk overlays (`/modules/gis`).
5.  **Market Intelligence**: M&A watchlist, infrastructure status, rig counts (`/modules/intel`).
6.  **Risk & Regulatory**: Geopolitical events, operational alerts (`/modules/risk`).

## Getting Started

### Prerequisites

*   Node.js >= 18
*   pnpm >= 8

### Installation

```bash
pnpm install
```

### Local Development

1.  Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```

2.  Build shared packages:
    ```bash
    pnpm build --filter @petrosquare/types
    pnpm build --filter @petrosquare/ui
    ```

3.  Start the development server:
    ```bash
    pnpm dev
    ```

    Access the app at `http://localhost:3000`.

### Data Modes

*   **NO_DB (Default)**: Uses in-memory mock data and synthetic generators. No database required.
*   **DB_ENABLED**: Connects to Postgres/TimescaleDB (requires `DATABASE_URL` and migration setup).

## Feature Flags

Control module availability via `.env`:

*   `MODULE_MARKETS`
*   `MODULE_PRODUCTION_RESERVES`
*   `MODULE_ECONOMICS`
*   `MODULE_GIS_ASSET_INTEL`
*   `MODULE_MARKET_INTEL_INFRA`
*   `MODULE_RISK_REGULATORY`

## Testing

Run unit and integration tests:

```bash
pnpm test
```

## System Health

View system status and connector health at `/health`.
