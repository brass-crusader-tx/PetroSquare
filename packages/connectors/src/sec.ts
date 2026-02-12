import { z } from 'zod';
import type { FilingFeedResponse, Provenance, ApiResponse } from '@petrosquare/types';

// SEC returns columnar data in arrays
const SecSubmissionSchema = z.object({
  name: z.string(),
  tickers: z.array(z.string()),
  cik: z.string(),
  filings: z.object({
    recent: z.object({
      accessionNumber: z.array(z.string()),
      filingDate: z.array(z.string()),
      form: z.array(z.string()),
      primaryDocument: z.array(z.string()),
      primaryDocDescription: z.array(z.string().nullable().optional()), // nullable or optional
    })
  })
});

const BASE_URL = 'https://data.sec.gov/submissions';
const USER_AGENT = 'PetroSquare Platform (admin@petrosquare.com)'; // Required by SEC

export const fetchRecentFilings = async (
  ciks: string[],
  limit: number = 10
): Promise<ApiResponse<FilingFeedResponse>> => {
  if (ciks.length === 0) {
    return {
      data: { filings: [] },
      status: 'ok',
      provenance: {
        source_name: 'SEC EDGAR',
        source_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
        retrieved_at: new Date().toISOString(),
        units: 'Filings',
        notes: 'No CIKs provided',
      }
    };
  }

  // Fetch for each CIK
  // We'll settle all promises
  const promises = ciks.map(async (cik) => {
    // Pad CIK to 10 digits
    const paddedCik = cik.padStart(10, '0');
    const url = `${BASE_URL}/CIK${paddedCik}.json`;

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        next: { revalidate: 600 } // 10 mins
      } as RequestInit);

      if (!res.ok) {
        console.warn(`SEC API Error for ${cik}: ${res.status}`);
        return null;
      }

      const raw = await res.json();
      const parsed = SecSubmissionSchema.safeParse(raw);

      if (!parsed.success) {
        console.error(`SEC Parse Error for ${cik}:`, parsed.error);
        return null;
      }

      return parsed.data;
    } catch (e) {
      console.error(`SEC Fetch Error for ${cik}:`, e);
      return null;
    }
  });

  const results = await Promise.all(promises);

  const allFilings: Array<FilingFeedResponse['filings'][0]> = [];

  for (const companyData of results) {
    if (!companyData) continue;

    const { name, tickers, filings, cik } = companyData;
    const recent = filings.recent;
    const ticker = tickers[0] || 'UNKNOWN';

    // Iterate up to limit or available
    const count = Math.min(limit, recent.accessionNumber.length);

    for (let i = 0; i < count; i++) {
      allFilings.push({
        company: name,
        ticker: ticker,
        form_type: recent.form[i],
        filed_at: recent.filingDate[i], // YYYY-MM-DD
        // Construct link: https://www.sec.gov/Archives/edgar/data/{cik}/{accession_no_dashes}/{primaryDocument}
        // recent.accessionNumber has dashes (e.g. 0001234567-24-000123).
        link: `https://www.sec.gov/Archives/edgar/data/${cik}/${recent.accessionNumber[i].replace(/-/g, '')}/${recent.primaryDocument[i]}`
      });
    }
  }

  // Sort by date desc
  allFilings.sort((a, b) => new Date(b.filed_at).getTime() - new Date(a.filed_at).getTime());

  // Slice final limit
  const finalFilings = allFilings.slice(0, limit);

  // Status logic:
  // If we got NO results but expected some (i.e. we had CIKs and returned nulls), then degraded.
  // If we got partial results, maybe 'degraded' but with data?
  // Let's say 'ok' if we have *any* data, 'degraded' if partial or empty due to error.
  const hasErrors = results.some(r => r === null);
  const hasData = finalFilings.length > 0;

  let status: 'ok' | 'degraded' = 'ok';
  if (hasErrors) status = 'degraded';
  if (!hasData && hasErrors) status = 'degraded';

  return {
    data: { filings: finalFilings },
    status,
    provenance: {
        source_name: 'SEC EDGAR',
        source_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
        retrieved_at: new Date().toISOString(),
        units: 'Filings',
        notes: `Recent filings for CIKs: ${ciks.join(', ')}`,
        cache_policy: 'revalidate: 600s',
    }
  };
};
