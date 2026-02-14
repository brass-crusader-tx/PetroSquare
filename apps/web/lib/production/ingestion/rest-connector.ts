import { Connector, IngestionResult } from './connector.interface';
import { ProductionSeries } from '@petrosquare/types';

export class RestConnector implements Connector {
  async fetch(url: string, options?: any): Promise<IngestionResult> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const records = Array.isArray(json) ? json : (json.data || []);

      const validData: ProductionSeries[] = [];
      const errors: string[] = [];

      records.forEach((record: any, index: number) => {
        const normalized = this.normalize(record);
        if (normalized) {
          validData.push(normalized);
        } else {
          errors.push(`Record ${index}: Validation failed`);
        }
      });

      return {
        data: validData,
        errors,
        metadata: {
          total_records: records.length,
          valid_records: validData.length,
          failed_records: errors.length,
          source: url,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        data: [],
        errors: [error.message],
        metadata: {
          total_records: 0,
          valid_records: 0,
          failed_records: 0,
          source: url,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  validate(record: any): boolean {
    // Basic validation: must have asset_id, timestamp, value
    return !!(record.asset_id && record.timestamp && record.value !== undefined);
  }

  normalize(record: any): ProductionSeries | null {
    if (!this.validate(record)) return null;

    // Map external fields to canonical model
    // Assuming a standard JSON structure, but could be customized via options
    return {
      asset_id: record.asset_id,
      series_id: record.series_id || `${record.asset_id}-${record.measurement || 'unknown'}`,
      timestamp: new Date(record.timestamp).toISOString(),
      value: Number(record.value),
      measurement: (record.measurement as any) || 'OIL_RATE', // Default or map
      unit: record.unit || 'bbl/d',
      source_system: 'REST_API',
      ingested_at: new Date().toISOString(),
      quality_flags: record.quality_flags || [],
      tags: record.tags || {}
    };
  }
}
