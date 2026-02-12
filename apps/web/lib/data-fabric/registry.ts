import { Provenance } from '@petrosquare/types';

export interface DataSource {
  id: string;
  name: string;
  url: string;
  update_frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'static';
  license: string;
  status: 'active' | 'deprecated' | 'beta';
}

export const DATA_SOURCES: Record<string, DataSource> = {
  'eia-api': {
    id: 'eia-api',
    name: 'US Energy Information Administration (EIA)',
    url: 'https://api.eia.gov/v2/',
    update_frequency: 'daily',
    license: 'Public Domain',
    status: 'active'
  },
  'cer-open-data': {
    id: 'cer-open-data',
    name: 'Canada Energy Regulator (CER)',
    url: 'https://www.cer-rec.gc.ca/en/data-analysis/',
    update_frequency: 'monthly',
    license: 'Open Government Licence - Canada',
    status: 'active'
  },
  'noaa-weather': {
    id: 'noaa-weather',
    name: 'NOAA National Weather Service',
    url: 'https://api.weather.gov/',
    update_frequency: 'realtime',
    license: 'Public Domain',
    status: 'active'
  },
  'sec-edgar': {
    id: 'sec-edgar',
    name: 'SEC EDGAR',
    url: 'https://www.sec.gov/edgar/',
    update_frequency: 'daily',
    license: 'Public Domain',
    status: 'active'
  },
  'petrosquare-demo': {
    id: 'petrosquare-demo',
    name: 'PetroSquare Synthetic Data Engine',
    url: 'internal://demo-generator',
    update_frequency: 'realtime',
    license: 'Proprietary',
    status: 'beta'
  }
};

export function createProvenance(sourceId: string, notes?: string): Provenance {
  const source = DATA_SOURCES[sourceId] || DATA_SOURCES['petrosquare-demo'];

  return {
    source_name: source.name,
    source_url: source.url,
    retrieved_at: new Date().toISOString(),
    notes: notes,
    cache_policy: 'max-age=3600'
  };
}
