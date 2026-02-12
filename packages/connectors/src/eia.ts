import { z } from 'zod';
import type { MarketBenchmarkResponse, InventorySeriesResponse, Provenance, ApiResponse } from '@petrosquare/types';

// Zod schemas for EIA API v2 response
const EiaDataPointSchema = z.object({
  period: z.string(),
  value: z.number().nullable().or(z.string().transform((v) => (v ? parseFloat(v) : null))),
  series: z.string().optional(),
  'series-description': z.string().optional(),
  units: z.string().optional(),
});

const EiaResponseSchema = z.object({
  response: z.object({
    data: z.array(EiaDataPointSchema),
  }),
});

// Using EIA API v2
// Facets for series:
// WTI Spot Price FOB (Dollars per Barrel): RWTC
// Europe Brent Spot Price FOB (Dollars per Barrel): RBRTE
// Weekly U.S. Ending Stocks of Crude Oil (Thousand Barrels): WCRSTUS1

const BASE_URL = 'https://api.eia.gov/v2';

export const fetchBenchmarkPrices = async (apiKey: string): Promise<ApiResponse<MarketBenchmarkResponse>> => {
  if (!apiKey) {
    return {
      data: null,
      status: 'degraded',
      error: 'Missing EIA_API_KEY',
      provenance: {
        source_name: 'EIA',
        source_url: 'https://www.eia.gov/opendata/',
        retrieved_at: new Date().toISOString(),
        units: 'USD/bbl',
        notes: 'Configuration error: Missing API Key',
      },
    };
  }

  // Fetch WTI and Brent together or separately?
  // Separately is safer to avoid confusion if facets don't return correctly in mixed response.
  // But let's try together first with series facet.
  // URL: /petroleum/pri/spt/data/?api_key=...&frequency=daily&data[0]=value&facets[series][]=RWTC&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&length=2
  // We need to request 'series' in data to distinguish.
  const url = `${BASE_URL}/petroleum/pri/spt/data/?api_key=${apiKey}&frequency=daily&data[0]=value&data[1]=series&facets[series][]=RWTC&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&length=10`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit);
    if (!res.ok) {
      throw new Error(`EIA API Error: ${res.status} ${res.statusText}`);
    }
    const raw = await res.json();
    const parsed = EiaResponseSchema.safeParse(raw);

    if (!parsed.success) {
      console.error('EIA Parse Error:', parsed.error);
      throw new Error('Invalid EIA response structure');
    }

    const data = parsed.data.response.data;

    // Find latest valid WTI
    const wti = data.find((d) => d.series === 'RWTC' && d.value !== null);
    // Find latest valid Brent
    const brent = data.find((d) => d.series === 'RBRTE' && d.value !== null);

    return {
      data: {
        wti_price: wti?.value ?? null,
        brent_price: brent?.value ?? null,
        unit: 'USD/bbl',
        last_updated: wti?.period || brent?.period || new Date().toISOString(),
      },
      status: wti && brent ? 'ok' : 'degraded',
      provenance: {
        source_name: 'U.S. Energy Information Administration (EIA)',
        source_url: 'https://www.eia.gov/petroleum/data.php',
        retrieved_at: new Date().toISOString(),
        units: 'USD/bbl',
        notes: 'Spot Prices (RWTC, RBRTE)',
        cache_policy: 'revalidate: 3600s',
      },
    };
  } catch (error) {
    return {
      data: null,
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error',
      provenance: {
        source_name: 'EIA',
        source_url: 'https://www.eia.gov/',
        retrieved_at: new Date().toISOString(),
        units: 'USD/bbl',
        notes: 'Failed to fetch benchmark prices',
      },
    };
  }
};

export const fetchCrudeInventories = async (apiKey: string): Promise<ApiResponse<InventorySeriesResponse>> => {
  if (!apiKey) {
    return {
      data: null,
      status: 'degraded',
      error: 'Missing EIA_API_KEY',
      provenance: {
        source_name: 'EIA',
        source_url: 'https://www.eia.gov/',
        retrieved_at: new Date().toISOString(),
        units: 'Mbbl',
        notes: 'Configuration error',
      },
    };
  }

  // Weekly U.S. Ending Stocks of Crude Oil (Thousand Barrels): WCRSTUS1
  // URL: /petroleum/stoc/wstk/data/?api_key=...&frequency=weekly&data[0]=value&facets[series][]=WCRSTUS1&sort[0][column]=period&sort[0][direction]=desc&length=12
  const url = `${BASE_URL}/petroleum/stoc/wstk/data/?api_key=${apiKey}&frequency=weekly&data[0]=value&facets[series][]=WCRSTUS1&sort[0][column]=period&sort[0][direction]=desc&length=12`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 * 24 } } as RequestInit); // Daily revalidate for weekly data
    if (!res.ok) {
      throw new Error(`EIA API Error: ${res.status}`);
    }
    const raw = await res.json();
    const parsed = EiaResponseSchema.safeParse(raw);

    if (!parsed.success) {
        throw new Error('Invalid EIA response structure');
    }

    const series = parsed.data.response.data
      .filter((d) => d.value !== null)
      .map((d) => ({
        date: d.period,
        value: d.value!,
      }));

    return {
      data: {
        series,
        unit: 'Thousand Barrels',
      },
      status: series.length > 0 ? 'ok' : 'degraded',
      provenance: {
        source_name: 'EIA',
        source_url: 'https://www.eia.gov/petroleum/supply/weekly/',
        retrieved_at: new Date().toISOString(),
        units: 'Thousand Barrels',
        notes: 'Weekly U.S. Ending Stocks of Crude Oil (WCRSTUS1)',
        cache_policy: 'revalidate: 86400s',
      },
    };

  } catch (error) {
    return {
      data: null,
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error',
      provenance: {
        source_name: 'EIA',
        source_url: 'https://www.eia.gov/',
        retrieved_at: new Date().toISOString(),
        units: 'Mbbl',
        notes: 'Failed to fetch inventory data',
      },
    };
  }
};
