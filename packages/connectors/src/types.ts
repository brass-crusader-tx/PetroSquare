export interface Provenance {
  source_name: string;
  source_url: string;
  retrieved_at: string;
  notes?: string;
}

export interface TimeSeriesPoint {
  period: string; // YYYY-MM or YYYY
  value: number;
}

export interface ProductionSeriesResponse {
  series: TimeSeriesPoint[];
  units: string;
  frequency: string;
  provenance: Provenance;
}

export interface ReservesSeriesResponse {
  series: TimeSeriesPoint[];
  units: string;
  frequency: string;
  provenance: Provenance;
}
