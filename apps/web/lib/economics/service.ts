import { db } from './data';
import { EconomicsEngine } from './engine';
import { EconomicsScenario, EconomicsScenarioVersion, EconomicsRun, EconomicsScenarioInput, EconomicsRunResult } from '@petrosquare/types';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export class EconomicsService {

  static async listScenarios(orgId: string) {
    return db.listScenarios(orgId);
  }

  static async getScenario(id: string) {
    const scenario = await db.getScenario(id);
    if (!scenario) return null;
    const versions = await db.listVersions(id);
    const latestVersion = versions[0];
    return { ...scenario, latestVersion };
  }

  static async createScenario(orgId: string, userId: string, name: string, description?: string, input?: EconomicsScenarioInput) {
    const id = generateId();
    const scenario: EconomicsScenario = {
      id,
      org_id: orgId,
      created_by: userId,
      name,
      description,
      status: 'DRAFT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.createScenario(scenario);

    // Create initial version
    const versionId = generateId();
    const initialInput = input || this.getDefaultInput();
    const version: EconomicsScenarioVersion = {
      id: versionId,
      scenario_id: id,
      version: 1,
      name: 'Initial Version',
      input_payload_json: initialInput,
      created_by: userId,
      created_at: new Date().toISOString()
    };

    await db.createVersion(version);

    return scenario;
  }

  static async createVersion(scenarioId: string, userId: string, input: EconomicsScenarioInput, name?: string) {
    const versions = await db.listVersions(scenarioId);
    const nextVersionNum = (versions[0]?.version || 0) + 1;

    const versionId = generateId();
    const version: EconomicsScenarioVersion = {
      id: versionId,
      scenario_id: scenarioId,
      version: nextVersionNum,
      name: name || `Version ${nextVersionNum}`,
      input_payload_json: input,
      created_by: userId,
      created_at: new Date().toISOString()
    };

    await db.createVersion(version);
    return version;
  }

  static async runSimulation(versionId: string, userId: string): Promise<EconomicsRun> {
    const version = await db.getVersion(versionId);
    if (!version) throw new Error('Version not found');

    const runId = generateId();
    const run: EconomicsRun = {
      id: runId,
      scenario_version_id: versionId,
      status: 'QUEUED',
      created_at: new Date().toISOString()
    };

    await db.createRun(run);

    // Execute asynchronously (simulate queue)
    this.executeRun(runId, version.input_payload_json).catch(err => console.error("Run failed", err));

    return run;
  }

  private static async executeRun(runId: string, input: EconomicsScenarioInput) {
    try {
      await db.updateRun(runId, { status: 'RUNNING', started_at: new Date().toISOString() });

      // Simulate compute time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = EconomicsEngine.run(input);

      await db.updateRun(runId, {
        status: 'COMPLETED',
        finished_at: new Date().toISOString(),
        result_payload_json: result
      });
    } catch (error: any) {
      await db.updateRun(runId, {
        status: 'FAILED',
        finished_at: new Date().toISOString(),
        error_json: { message: error.message, stack: error.stack }
      });
    }
  }

  static async getRun(runId: string) {
    return db.getRun(runId);
  }

  static async getRunsForVersion(versionId: string) {
    return db.listRuns(versionId);
  }

  static getDefaultInput(): EconomicsScenarioInput {
    return {
      general: {
        start_date: new Date().toISOString().slice(0, 10),
        project_duration_years: 20,
        currency: 'USD',
        discount_rate_percent: 10
      },
      production: {
        curve_type: 'DECLINE',
        initial_rate: 1000, // bbl/d
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
  }
}
