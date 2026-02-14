import { ProductionSeries } from '@petrosquare/types';

export interface IngestionResult {
  data: ProductionSeries[];
  errors: string[];
  metadata: {
    total_records: number;
    valid_records: number;
    failed_records: number;
    source: string;
    timestamp: string;
  };
}

export interface Connector {
  /**
   * Fetch data from the source.
   * @param source The source identifier (URL, file path, etc.)
   * @param options Optional configuration for the fetch
   */
  fetch(source: string, options?: Record<string, any>): Promise<IngestionResult>;

  /**
   * Validate a single record.
   * @param record The raw record from the source
   */
  validate(record: any): boolean;

  /**
   * Normalize a raw record into the canonical ProductionSeries format.
   * @param record The raw record
   */
  normalize(record: any): ProductionSeries | null;
}
