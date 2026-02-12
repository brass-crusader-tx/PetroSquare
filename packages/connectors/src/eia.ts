import { z } from 'zod';
import type { MarketData, Provenance } from '@petrosquare/types';

const EIA_BASE_URL = 'https://api.eia.gov/v2';

// Schema for EIA v2 response (simplified for reliability)
const EiaResponseSchema = z.object({
  response: z.object({
    data: z.array(z.object({
      period: z.string(),
      value: z.number().or(z.string().transform(v => parseFloat(v))),
      units: z.string().optional(),
      'series-description': z.string().optional(),
    })).min(1),
  }),
});

export async function fetchEiaSpotPrice(seriesId: string, symbol: string): Promise<MarketData> {
  const apiKey = process.env.EIA_API_KEY;

  if (!apiKey) {
    throw new Error('EIA_API_KEY is not configured');
  }

  // Construct URL for V2 API
  // Route: /petroleum/pri/spt/data
  const url = `${EIA_BASE_URL}/petroleum/pri/spt/data/?api_key=${apiKey}&frequency=daily&data[0]=value&facets[series][]=${seriesId}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`EIA API Error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const result = EiaResponseSchema.safeParse(json);

    if (!result.success) {
      console.error('EIA Schema Validation Failed:', result.error);
      throw new Error('Invalid response format from EIA');
    }

    const data = result.data.response.data[0];

    const provenance: Provenance = {
      sourceName: 'U.S. Energy Information Administration',
      sourceUrl: 'https://www.eia.gov/',
      retrievedAt: new Date().toISOString(),
      license: 'Public Domain',
    };

    return {
      symbol,
      price: data.value,
      unit: 'USD/bbl',
      currency: 'USD',
      provenance,
    };
  } catch (error) {
    console.error(`Failed to fetch EIA data for ${seriesId}:`, error);
    throw error;
  }
}
