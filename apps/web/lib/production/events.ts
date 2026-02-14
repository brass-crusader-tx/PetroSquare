import { EventEmitter } from 'events';

class ProductionEventBus extends EventEmitter {
  private static instance: ProductionEventBus;

  private constructor() {
    super();
  }

  static getInstance(): ProductionEventBus {
    if (!ProductionEventBus.instance) {
      ProductionEventBus.instance = new ProductionEventBus();
    }
    return ProductionEventBus.instance;
  }

  emitSeriesUpdated(assetId: string, seriesIds: string[]) {
    this.emit('production.series.updated', { assetId, seriesIds, timestamp: new Date().toISOString() });
  }

  emitAnomalyDetected(assetId: string, anomalyId: string) {
    this.emit('production.anomaly.detected', { assetId, anomalyId, timestamp: new Date().toISOString() });
  }

  emitJobCompleted(jobId: string, type: string) {
    this.emit('production.job.completed', { jobId, type, timestamp: new Date().toISOString() });
  }
}

export const events = ProductionEventBus.getInstance();
