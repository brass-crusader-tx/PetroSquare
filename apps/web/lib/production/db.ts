import { ProductionSeries, DcaModel, Scenario, Anomaly, JobStatus, TimeSeriesPoint } from '@petrosquare/types';

// In-memory store (simulating DB)
class ProductionRepository {
  private static instance: ProductionRepository;

  private seriesStore: Map<string, ProductionSeries[]> = new Map(); // key: assetId-measurement
  private dcaModels: Map<string, DcaModel[]> = new Map();
  private scenarios: Map<string, Scenario[]> = new Map();
  private anomalies: Map<string, Anomaly[]> = new Map();
  private jobs: Map<string, JobStatus> = new Map();

  private constructor() {
    this.seedData();
  }

  static getInstance(): ProductionRepository {
    if (!ProductionRepository.instance) {
      ProductionRepository.instance = new ProductionRepository();
    }
    return ProductionRepository.instance;
  }

  private seedData() {
    const assetId = 'well-01';
    const measurements: ('OIL_RATE' | 'GAS_RATE' | 'WATER_RATE')[] = ['OIL_RATE', 'GAS_RATE', 'WATER_RATE'];

    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); // 1 year ago

    measurements.forEach(m => {
        const seriesKey = `${assetId}-${m}`;
        const data: ProductionSeries[] = [];
        let value = m === 'OIL_RATE' ? 1000 : (m === 'GAS_RATE' ? 5000 : 200);

        for (let d = 0; d < 365; d++) {
            const date = new Date(start.getTime() + d * 24 * 60 * 60 * 1000);
            // Simple decline + noise
            const decline = Math.exp(-0.005 * d);
            const noise = (Math.random() - 0.5) * 0.1 * value;

            data.push({
                asset_id: assetId,
                series_id: seriesKey,
                timestamp: date.toISOString(),
                value: Math.max(0, (value * decline) + noise),
                measurement: m,
                unit: m === 'OIL_RATE' ? 'bbl/d' : (m === 'GAS_RATE' ? 'mcf/d' : 'bbl/d'),
                source_system: 'SEED',
                ingested_at: now.toISOString(),
                quality_flags: [],
                tags: {}
            });
        }
        this.seriesStore.set(seriesKey, data);
    });

    // Seed DCA Model
    this.dcaModels.set(assetId, [{
        id: 'dca-model-1',
        asset_id: assetId,
        type: 'EXPONENTIAL',
        params: { qi: 1000, di: 0.15 },
        goodness_of_fit: { r2: 0.95, rmse: 12.5 },
        created_at: now.toISOString()
    }]);

    // Seed Scenarios
    this.scenarios.set(assetId, [{
        id: 'scenario-base',
        name: 'Base Case',
        asset_id: assetId,
        modifications: {},
        is_committed: true,
        created_at: now.toISOString(),
        created_by: 'system'
    }]);
  }

  // --- Series Methods ---

  async getSeries(assetId: string, measurement: string): Promise<ProductionSeries[]> {
    const key = `${assetId}-${measurement}`;
    return this.seriesStore.get(key) || [];
  }

  async upsertSeries(series: ProductionSeries[]): Promise<void> {
      series.forEach(s => {
          const key = `${s.asset_id}-${s.measurement}`;
          const current = this.seriesStore.get(key) || [];
          // Simple append/replace logic for mock
          // In real DB, we'd use time-bucket upsert
          const existingIndex = current.findIndex(c => c.timestamp === s.timestamp);
          if (existingIndex >= 0) {
              current[existingIndex] = s;
          } else {
              current.push(s);
          }
          // Sort by time
          current.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          this.seriesStore.set(key, current);
      });
  }

  // --- DCA Methods ---

  async getDcaModels(assetId: string): Promise<DcaModel[]> {
      return this.dcaModels.get(assetId) || [];
  }

  async saveDcaModel(model: DcaModel): Promise<void> {
      const existing = this.dcaModels.get(model.asset_id) || [];
      this.dcaModels.set(model.asset_id, [...existing, model]);
  }

  // --- Scenario Methods ---

  async getScenarios(assetId: string): Promise<Scenario[]> {
      return this.scenarios.get(assetId) || [];
  }

  async createScenario(scenario: Scenario): Promise<void> {
      const existing = this.scenarios.get(scenario.asset_id) || [];
      this.scenarios.set(scenario.asset_id, [...existing, scenario]);
  }

  // --- Anomaly Methods ---

  async getAnomalies(assetId: string): Promise<Anomaly[]> {
      return this.anomalies.get(assetId) || [];
  }

  async createAnomaly(anomaly: Anomaly): Promise<void> {
      const existing = this.anomalies.get(anomaly.asset_id) || [];
      this.anomalies.set(anomaly.asset_id, [...existing, anomaly]);
  }

  // --- Job Methods ---

  async getJob(id: string): Promise<JobStatus | undefined> {
      return this.jobs.get(id);
  }

  async createJob(job: JobStatus): Promise<void> {
      this.jobs.set(job.id, job);
  }

  async updateJob(id: string, updates: Partial<JobStatus>): Promise<void> {
      const job = this.jobs.get(id);
      if (job) {
          this.jobs.set(id, { ...job, ...updates, updated_at: new Date().toISOString() });
      }
  }
}

export const db = ProductionRepository.getInstance();
