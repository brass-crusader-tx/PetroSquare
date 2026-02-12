import Papa from 'papaparse';
import { z } from 'zod';

const CER_DATA_URL = 'https://www.cer-rec.gc.ca/open/energy/estimated-monthly-production-of-crude-oil-by-province.csv';

import { Provenance, ProductionSeriesResponse, TimeSeriesPoint } from '../types';

// --- Helper Functions ---

const CerRowSchema = z.object({
  Date: z.string(),
  Unit: z.string(),
  Region: z.string(),
  Type: z.string(),
  Value: z.string(), // CSV values are strings initially
});

type CerRow = z.infer<typeof CerRowSchema>;

// Cache the CSV fetch/parse for a short time to avoid hitting CER on every request if concurrency is high
let cachedData: CerRow[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 1000 * 60 * 60; // 1 hour

async function fetchCerData(): Promise<CerRow[]> {
  const now = Date.now();
  if (cachedData && (now - lastFetchTime < CACHE_DURATION_MS)) {
    return cachedData;
  }

  // console.log('Fetching CER CSV...');
  const res = await fetch(CER_DATA_URL);
  if (!res.ok) {
    throw new Error(`CER CSV Fetch Error: ${res.status} ${res.statusText}`);
  }
  const csvText = await res.text();

  const parsed = Papa.parse<CerRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
     throw new Error(`CER CSV Parse Error: ${parsed.errors[0].message}`);
  }

  // Validate rows with Zod (optional but recommended)
  const validRows: CerRow[] = [];
  parsed.data.forEach((row: any) => {
      const result = CerRowSchema.safeParse(row);
      if (result.success) {
          validRows.push(result.data);
      }
  });

  cachedData = validRows;
  lastFetchTime = now;
  return validRows;
}

function parseCerDate(dateStr: string): string {
  // Expected format: M/D/YYYY or YYYY-MM-DD
  // Check if it matches M/D/YYYY
  const parts = dateStr.split('/');
  if (parts.length === 3) {
      // Assuming M/D/YYYY or D/M/YYYY.
      // Monthly data usually starts on day 1.
      // Let's assume M is first if <= 12.
      // Actually standard Date.parse handles M/D/YYYY well.
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
          return d.toISOString().slice(0, 7); // YYYY-MM
      }
  }
  // Try direct date parse
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 7);
  }
  return dateStr; // Fallback
}

// Conversion factor: 1 m3 = 6.28981 barrels
const M3_TO_BBL = 6.28981;

// --- Public API ---

export const CA_PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
];

export function listCaProvinces() {
  return CA_PROVINCES;
}

export async function fetchCaProvinceProduction(
  provinceCode: string,
  options?: { start?: string; end?: string; frequency?: string }
): Promise<ProductionSeriesResponse> {
  const data = await fetchCerData();

  // Filter by Region and Type
  // Note: Region codes in CSV (e.g., 'NL', 'ON') match our codes.
  // We want 'Total' crude production.

  // Group by Date to handle duplicates if any, but 'Total' Type should be unique per date/region.
  // 'Total' only exists for Region='Canada'. For provinces, we sum components.

  const periodMap = new Map<string, number>();

  data.forEach(row => {
    if (row.Region !== provinceCode) return;

    // Filter types to sum for "Crude Oil and Equivalent"
    // Exclude 'Total' (Canada only anyway)
    // Exclude 'Mined bitumen' and 'In situ bitumen' (Raw extraction, can overlap with Upgraded/Non-upgraded or be double counted)
    // Include: 'Light', 'Heavy', 'Condensate', 'Upgraded', 'Non-upgraded'
    if (['Total', 'Mined bitumen', 'In situ bitumen'].includes(row.Type)) return;

    // Filter by Unit (CSV contains both Metric and Imperial)
    // We use Cubic metres (noting the typo in CSV 'meres') and convert to barrels
    if (row.Unit !== 'Cubic meres per day') return;

    const period = parseCerDate(row.Date);

    // Convert m3/d to MBBL/d
    let val = parseFloat(row.Value);
    if (isNaN(val)) val = 0;

    val = (val * M3_TO_BBL) / 1000;

    periodMap.set(period, (periodMap.get(period) || 0) + val);
  });

  const series: TimeSeriesPoint[] = [];
  periodMap.forEach((val, period) => {
      if (options?.start && period < options.start) return;
      if (options?.end && period > options.end) return;
      series.push({ period, value: val });
  });

  series.sort((a, b) => b.period.localeCompare(a.period));

  return {
    series,
    units: 'MBBL/d',
    frequency: 'monthly',
    provenance: {
        source_name: 'CER',
        source_url: CER_DATA_URL,
        retrieved_at: new Date().toISOString(),
        notes: 'Estimated Monthly Production (Converted from m3/d to MBBL/d)',
    }
  };
}

export async function fetchCaProvinceProductionLatest(provinceCode: string) {
    const response = await fetchCaProvinceProduction(provinceCode);
    if (response.series.length === 0) return null;
    return { ...response.series[0], units: response.units };
}
