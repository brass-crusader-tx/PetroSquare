import { Anomaly, ProductionSeries } from '@petrosquare/types';
import { db } from '../db';
import { events } from '../events';

// Simple UUID generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class AnomalyService {
  /**
   * Detects anomalies in a production series using simple Z-score.
   * @param series The production series to analyze.
   * @param thresholdZ The Z-score threshold (default 3).
   */
  static detect(series: ProductionSeries[], thresholdZ: number = 3): Anomaly[] {
    if (series.length < 10) return []; // Need minimum data

    const values = series.map(s => s.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);

    if (stdDev === 0) return [];

    const anomalies: Anomaly[] = [];

    series.forEach(point => {
      const zScore = (point.value - mean) / stdDev;
      if (Math.abs(zScore) > thresholdZ) {
        const type = zScore > 0 ? 'SPIKE' : 'DROP';
        const severity = Math.abs(zScore) > 5 ? 'HIGH' : (Math.abs(zScore) > 4 ? 'MEDIUM' : 'LOW');

        anomalies.push({
          id: generateId(),
          asset_id: point.asset_id,
          series_id: point.series_id,
          timestamp: point.timestamp,
          severity,
          type,
          explanation: `Z-score: ${zScore.toFixed(2)}. Value ${point.value} is significantly different from mean ${mean.toFixed(2)}.`,
          created_at: new Date().toISOString()
        });
      }
    });

    return anomalies;
  }

  static async scanAndSave(assetId: string): Promise<number> {
    const series = await db.getSeries(assetId, 'OIL_RATE'); // Default to oil
    const anomalies = this.detect(series);

    let newCount = 0;
    for (const anomaly of anomalies) {
        // Check if exists? Simpler just to save for this exercise
        // Ideally we check timestamp + type to avoid dupes
        await db.createAnomaly(anomaly);
        events.emitAnomalyDetected(assetId, anomaly.id);
        newCount++;
    }
    return newCount;
  }
}
