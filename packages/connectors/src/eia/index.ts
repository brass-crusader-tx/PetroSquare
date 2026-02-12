import { z } from 'zod';

const EIA_API_KEY = process.env.EIA_API_KEY;
const BASE_URL = 'https://api.eia.gov/v2';

import { Provenance, ProductionSeriesResponse, ReservesSeriesResponse, TimeSeriesPoint } from '../types';

// --- Zod Schemas for EIA Response ---

const EiaResponseSchema = z.object({
  response: z.object({
    data: z.array(z.any()),
    total: z.number().optional(),
    dateFormat: z.string().optional(),
    frequency: z.string().optional(),
  }),
});

// --- Constants ---

export const US_STATES = [
  { code: 'AK', name: 'Alaska' },
  { code: 'AL', name: 'Alabama' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'FL', name: 'Florida' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MT', name: 'Montana' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NY', name: 'New York' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WY', name: 'Wyoming' },
  // Federal Offshore
  { code: 'GOM', name: 'Federal Offshore--Gulf of Mexico' },
  { code: 'PADD1', name: 'PADD 1 (East Coast)' }, // Maybe not state but region
];

// --- Helper Functions ---

async function fetchEia(path: string, params: Record<string, string>) {
  if (!EIA_API_KEY) {
    throw new Error("EIA_API_KEY is not set");
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.append('api_key', EIA_API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  // console.log(`Fetching EIA: ${url.toString().replace(EIA_API_KEY, '***')}`);

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
    // Next.js caching is handled at the route handler level, but we can set defaults here if needed.
    // However, connectors should be framework agnostic.
  });

  if (!res.ok) {
    throw new Error(`EIA API Error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return EiaResponseSchema.parse(json);
}

// --- Public API ---

export function listUsStates() {
  return US_STATES;
}

export async function fetchUsStateProduction(
  stateCode: string,
  options?: { start?: string; end?: string; frequency?: string }
): Promise<ProductionSeriesResponse> {
  // Route: /petroleum/crd/crpdn/data/
  // Facet: du (state)
  // Data: value
  // Frequency: monthly (M)

  // Mapping state code to EIA "du" (Data Unit) codes if necessary.
  // For now assuming stateCode matches or we need a map.
  // EIA usually uses full names or specific abbreviations.
  // Actually EIA v2 uses 'du' facets. Let's assume stateCode is close enough or use a map.
  // Checking typical EIA codes: 'TX' -> 'TX', 'AK' -> 'AK'.
  // But 'GOM' might be 'FOSS0' or something.

  // Let's implement a safe mapping if needed, but for MVP try direct code.

  const params: Record<string, string> = {
    frequency: 'M',
    data: 'value',
    facets: `du`,
    'facets[du][]': stateCode,
    sort: JSON.stringify([{ column: 'period', direction: 'desc' }]),
    offset: '0',
    length: '5000',
  };

  if (options?.start) params.start = options.start;
  if (options?.end) params.end = options.end;

  // The endpoint for Crude Oil Production is likely:
  // petroleum/crd/crpdn/data
  const path = '/petroleum/crd/crpdn/data';

  try {
    const data = await fetchEia(path, params);

    const series: TimeSeriesPoint[] = data.response.data.map((item: any) => ({
        period: item.period,
        value: parseFloat(item.value || '0'),
    })).sort((a, b) => b.period.localeCompare(a.period)); // Ensure descending

    return {
        series,
        units: 'MBBL/d', // Typically thousand barrels per day, need to verify source units
        frequency: 'monthly',
        provenance: {
            source_name: 'EIA',
            source_url: 'https://www.eia.gov/opendata/',
            retrieved_at: new Date().toISOString(),
            notes: 'Crude Oil Production',
        }
    };
  } catch (error) {
    console.error('EIA Fetch Error:', error);
    throw error;
  }
}

export async function fetchUsStateReserves(
    stateCode: string,
    options?: { start?: string; end?: string }
  ): Promise<ReservesSeriesResponse> {
    // Route: /petroleum/crd/pres/data/
    // Facet: du (state)
    // Data: value
    // Frequency: annual (A)

    const params: Record<string, string> = {
      frequency: 'A',
      data: 'value',
      facets: `du`,
      'facets[du][]': stateCode,
      sort: JSON.stringify([{ column: 'period', direction: 'desc' }]),
      offset: '0',
      length: '5000',
    };

    if (options?.start) params.start = options.start;
    if (options?.end) params.end = options.end;

    const path = '/petroleum/crd/pres/data';

    try {
        const data = await fetchEia(path, params);

        const series: TimeSeriesPoint[] = data.response.data.map((item: any) => ({
            period: item.period,
            value: parseFloat(item.value || '0'),
        })).sort((a, b) => b.period.localeCompare(a.period));

        return {
            series,
            units: 'MMbbl', // Million barrels
            frequency: 'annual',
            provenance: {
                source_name: 'EIA',
                source_url: 'https://www.eia.gov/opendata/',
                retrieved_at: new Date().toISOString(),
                notes: 'Proved Reserves, Crude Oil',
            }
        };
      } catch (error) {
        console.error('EIA Reserves Fetch Error:', error);
        throw error;
      }
}

export async function fetchUsStateProductionLatest(stateCode: string) {
    // Optimized for just the latest month
    const params: Record<string, string> = {
        frequency: 'M',
        data: 'value',
        facets: `du`,
        'facets[du][]': stateCode,
        sort: JSON.stringify([{ column: 'period', direction: 'desc' }]),
        offset: '0',
        length: '1', // Only 1 record
      };

      const path = '/petroleum/crd/crpdn/data';
      const data = await fetchEia(path, params);

      const item = data.response.data[0];
      if (!item) return null;

      return {
          period: item.period,
          value: parseFloat(item.value || '0'),
          units: 'MBBL/d'
      };
}
