import { Connector, IngestionResult } from './connector.interface';
import { ProductionSeries } from '@petrosquare/types';

export class CsvConnector implements Connector {
  private parseCsv(content: string): any[] {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        const record: any = {};
        headers.forEach((h, index) => {
          record[h] = values[index];
        });
        data.push(record);
      }
    }
    return data;
  }

  validate(record: any): boolean {
    return !!(record.asset_id && record.date && record.value && record.measure);
  }

  normalize(record: any): ProductionSeries | null {
    if (!this.validate(record)) return null;

    try {
      const value = parseFloat(record.value);
      if (isNaN(value)) return null;

      const measurementMap: Record<string, any> = {
        'oil': 'OIL_RATE',
        'gas': 'GAS_RATE',
        'water': 'WATER_RATE',
        'pressure': 'PRESSURE_TUBING'
      };

      const measure = measurementMap[record.measure.toLowerCase()] || 'OIL_RATE';

      return {
        asset_id: record.asset_id,
        series_id: `${record.asset_id}-${record.measure}`,
        timestamp: new Date(record.date).toISOString(),
        value: value,
        measurement: measure,
        unit: record.unit || (measure === 'GAS_RATE' ? 'mcf' : 'bbl'),
        source_system: 'CSV_UPLOAD',
        ingested_at: new Date().toISOString(),
        quality_flags: [],
        tags: {}
      };
    } catch (e) {
      return null;
    }
  }

  async fetch(content: string, options?: any): Promise<IngestionResult> {
    const rawData = this.parseCsv(content);
    const validData: ProductionSeries[] = [];
    const errors: string[] = [];

    rawData.forEach((record, index) => {
      const normalized = this.normalize(record);
      if (normalized) {
        validData.push(normalized);
      } else {
        errors.push(`Row ${index + 2}: Invalid data format`);
      }
    });

    return {
      data: validData,
      errors,
      metadata: {
        total_records: rawData.length,
        valid_records: validData.length,
        failed_records: errors.length,
        source: 'CSV',
        timestamp: new Date().toISOString()
      }
    };
  }
}
