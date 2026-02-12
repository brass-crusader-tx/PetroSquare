# Data Integration & Connectors

PetroSquare employs a vendor-neutral, layered architecture for data integration. All external data is normalized through the `@petrosquare/connectors` package before being exposed via typed API routes.

## Architecture

1.  **UI Layer**: Components (e.g., `DataPanel`) fetch data exclusively from PetroSquare API routes (`/api/data/*`). No direct external API calls.
2.  **API Layer**: Next.js Route Handlers (`apps/web/app/api/data/*`) orchestrate data fetching, caching (`revalidate`), and error handling.
3.  **Connector Layer**: The `@petrosquare/connectors` package wraps external APIs (EIA, NOAA, etc.) and normalizes responses into canonical types (`MarketData`, `WeatherContext`).
4.  **External Sources**: Public and proprietary APIs.

## Adding a New Connector

1.  **Create Connector**: Add a new file in `packages/connectors/src/` (e.g., `edgar.ts`).
2.  **Define Schema**: Use `zod` to define the external API's response schema for runtime validation.
3.  **Implement Fetch**: Write a function that fetches, validates, and transforms the data into a shared type from `@petrosquare/types`.
4.  **Export**: Export the function in `packages/connectors/src/index.ts`.
5.  **Create Route**: Add a new route handler in `apps/web/app/api/data/...` that uses the connector.

## Provenance

All data points must include a `provenance` object:
```typescript
interface Provenance {
  sourceName: string; // e.g., "U.S. Energy Information Administration"
  sourceUrl: string;  // Direct link to the source data
  retrievedAt: string; // ISO timestamp
  license?: string;   // e.g., "Public Domain"
}
```

## Environment Variables

Connectors may require environment variables. These should be set in `.env.local` for development and in the Vercel project settings for production.

-   **EIA_API_KEY**: Required for `fetchEiaSpotPrice` (Get one from [eia.gov](https://www.eia.gov/opendata/)).
    -   If missing, the API will return an empty dataset with an error message in the metadata, but will not crash.

## Caching

API routes use Next.js `revalidate` to cache responses.
-   Market Data: 1 hour (`revalidate = 3600`)
-   Weather Data: 30 minutes (`revalidate = 1800`)
