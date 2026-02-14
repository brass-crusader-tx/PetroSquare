import { EconomicsScenario, EconomicsScenarioVersion, EconomicsRun, EconomicsExport, EconomicsScenarioInput, RunStatus } from '@petrosquare/types';

export class EconomicsRepository {
  private static instance: EconomicsRepository;

  private scenarios: Map<string, EconomicsScenario> = new Map();
  private versions: Map<string, EconomicsScenarioVersion> = new Map();
  private runs: Map<string, EconomicsRun> = new Map();
  private exports: Map<string, EconomicsExport> = new Map();

  private constructor() {
    this.seedData();
  }

  static getInstance(): EconomicsRepository {
    if (!EconomicsRepository.instance) {
      EconomicsRepository.instance = new EconomicsRepository();
    }
    return EconomicsRepository.instance;
  }

  private seedData() {
    // Seed one scenario
    const scenarioId = 'scenario-001';
    const versionId = 'version-001';

    this.scenarios.set(scenarioId, {
      id: scenarioId,
      org_id: 'org-001',
      created_by: 'system',
      name: 'Permian Base Case',
      description: 'Standard type curve for Wolfcamp A',
      status: 'DRAFT',
      tags: ['permian', 'wolfcamp'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const defaultInput: EconomicsScenarioInput = {
      general: {
        start_date: new Date().toISOString().slice(0, 10),
        project_duration_years: 20,
        currency: 'USD',
        discount_rate_percent: 10
      },
      production: {
        curve_type: 'DECLINE',
        initial_rate: 1000,
        decline_rate_percent: 15
      },
      pricing: {
        oil_price_model: 'FLAT',
        flat_price: 75,
        escalation_percent: 2
      },
      costs: {
        opex_fixed_monthly: 5000,
        opex_variable_per_bbl: 2.5,
        capex_initial: 5000000,
        capex_abandonment: 100000,
        tax_rate_percent: 21,
        royalty_rate_percent: 12.5
      }
    };

    this.versions.set(versionId, {
      id: versionId,
      scenario_id: scenarioId,
      version: 1,
      name: 'Initial Setup',
      input_payload_json: defaultInput,
      created_by: 'system',
      created_at: new Date().toISOString()
    });
  }

  // --- Scenarios ---

  async listScenarios(orgId: string): Promise<EconomicsScenario[]> {
    return Array.from(this.scenarios.values()).filter(s => s.org_id === orgId);
  }

  async getScenario(id: string): Promise<EconomicsScenario | undefined> {
    return this.scenarios.get(id);
  }

  async createScenario(scenario: EconomicsScenario): Promise<void> {
    this.scenarios.set(scenario.id, scenario);
  }

  async updateScenario(id: string, updates: Partial<EconomicsScenario>): Promise<void> {
    const current = this.scenarios.get(id);
    if (current) {
      this.scenarios.set(id, { ...current, ...updates, updated_at: new Date().toISOString() });
    }
  }

  // --- Versions ---

  async listVersions(scenarioId: string): Promise<EconomicsScenarioVersion[]> {
    return Array.from(this.versions.values())
      .filter(v => v.scenario_id === scenarioId)
      .sort((a, b) => b.version - a.version);
  }

  async getVersion(id: string): Promise<EconomicsScenarioVersion | undefined> {
    return this.versions.get(id);
  }

  async createVersion(version: EconomicsScenarioVersion): Promise<void> {
    this.versions.set(version.id, version);
  }

  async getLatestVersion(scenarioId: string): Promise<EconomicsScenarioVersion | undefined> {
    const versions = await this.listVersions(scenarioId);
    return versions[0];
  }

  // --- Runs ---

  async getRun(id: string): Promise<EconomicsRun | undefined> {
    return this.runs.get(id);
  }

  async listRuns(versionId: string): Promise<EconomicsRun[]> {
    return Array.from(this.runs.values())
      .filter(r => r.scenario_version_id === versionId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createRun(run: EconomicsRun): Promise<void> {
    this.runs.set(run.id, run);
  }

  async updateRun(id: string, updates: Partial<EconomicsRun>): Promise<void> {
    const current = this.runs.get(id);
    if (current) {
      this.runs.set(id, { ...current, ...updates });
    }
  }
}

export const db = EconomicsRepository.getInstance();
