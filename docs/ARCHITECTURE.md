# PetroSquare Platform Architecture

## Overview
PetroSquare is a vendor-neutral digital operating system for oil and gas enterprises. The architecture is layered, modular, and service-oriented.

## Layers

### 1. Presentation / UI Layer (`apps/web`, `packages/ui`)
- **Technology**: Next.js, React, Tailwind CSS.
- **Responsibility**: Provides role-based portals for engineers, analysts, and executives.
- **Design System**: "Industrial" dark mode aesthetic, centralized in `packages/ui`.
- **Modules**: Domain-specific pages (e.g., Markets, Production) that render live data panels.

### 2. API & Integration Layer (`apps/api`, `packages/types`, `packages/connectors`)
- **Technology**: Node.js, Express, TypeScript.
- **Responsibility**: Exposes RESTful APIs, handles authentication, and orchestrates data flow.
- **Contracts**: Defined in `packages/types` to ensure type safety across frontend and backend.
- **Connectors**: Vendor-neutral data ingestion via `packages/connectors`.
  - **EIA**: Energy Information Administration (prices, inventory).
  - **OpenWeather**: Weather context for key hubs.
  - **SEC EDGAR**: Regulatory filings.

### 3. Data Flow (Live Data Slice)
1. **User Interface**: React components in `apps/web` fetch data from internal Next.js API Routes (`/api/data/*`).
2. **API Routes**: Next.js Route Handlers (`apps/web/app/api/data/*`) act as a proxy and caching layer. They call the shared connectors.
3. **Connectors**: Typescript functions in `packages/connectors` handling external API calls, validation (Zod), and normalization.
4. **External Sources**: Third-party APIs (EIA, OpenWeather, SEC) provide raw data.

**Failure Handling**:
- If an upstream source fails or times out (8s limit), the API returns a degraded status with cached or null data.
- The UI renders a warning badge but remains operational.
- Provenance metadata is attached to every response to trace data origin and latency.

### 4. Processing & Analytics Layer (Future)
- **Responsibility**: Distributed compute engines (Spark, K8s) for physics-based models and ML.

### 5. Data Storage & Management Layer (Future)
- **Responsibility**: Time-series DB for sensor data, spatial DB for GIS, and data lake for raw logs.

## Monorepo Structure
- `apps/`: Deployable applications.
- `packages/`: Shared libraries.
- `docs/`: Documentation.

## Deployment
- Containerized using Docker.
- Orchestrated via Kubernetes or Docker Compose.
- **Environment Variables**:
  - `EIA_API_KEY`: API Key for EIA v2.
  - `OPENWEATHER_API_KEY`: API Key for OpenWeatherMap.
  - `SEC_API_KEY`: Optional API Key for SEC (or User-Agent configuration).
