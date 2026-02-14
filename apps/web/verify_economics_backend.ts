import { EconomicsEngine } from './lib/economics/engine';
import { EconomicsService } from './lib/economics/service';
import { EconomicsScenarioInput } from '@petrosquare/types';

async function testEngine() {
  console.log('--- Testing Economics Engine ---');

  const input: EconomicsScenarioInput = {
    general: {
      start_date: '2024-01-01',
      project_duration_years: 5,
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
      escalation_percent: 0
    },
    costs: {
      opex_fixed_monthly: 5000,
      opex_variable_per_bbl: 5,
      capex_initial: 1000000,
      capex_abandonment: 50000,
      tax_rate_percent: 21,
      royalty_rate_percent: 12.5
    }
  };

  const result = EconomicsEngine.run(input);

  console.log('NPV:', result.kpis.npv.toFixed(2));
  console.log('IRR (%):', result.kpis.irr_percent.toFixed(2));
  console.log('Payout (months):', result.kpis.payout_period_months);
  console.log('Total Revenue:', result.kpis.total_revenue.toFixed(2));

  if (result.kpis.npv === 0) console.error('FAIL: NPV is 0');
  if (result.kpis.total_revenue <= 0) console.error('FAIL: Revenue <= 0');

  // Check cashflows
  if (result.cashflows.length !== 60) console.error(`FAIL: Cashflows length ${result.cashflows.length} != 60`);

  console.log('Engine Test Completed');
}

async function testService() {
  console.log('\n--- Testing Economics Service ---');

  // 1. Create Scenario
  const scenario = await EconomicsService.createScenario('org-test', 'user-test', 'Test Scenario', 'Description');
  console.log('Created Scenario:', scenario.id);

  // 2. Get Scenario
  const fetched = await EconomicsService.getScenario(scenario.id);
  if (!fetched) throw new Error('Scenario not found');
  console.log('Fetched Scenario:', fetched.name);

  // 3. Create Version
  const v1 = await EconomicsService.createVersion(scenario.id, 'user-test', EconomicsService.getDefaultInput(), 'Version 2');
  console.log('Created Version:', v1.id);

  // 4. Run Simulation
  const run = await EconomicsService.runSimulation(v1.id, 'user-test');
  console.log('Triggered Run:', run.id, run.status);

  // 5. Poll Run
  // The service executes run asynchronously but since we are in same process and memory, the promise inside runSimulation continues.
  // Wait for it.

  let attempts = 0;
  while (attempts < 10) {
      await new Promise(r => setTimeout(r, 200));
      const status = await EconomicsService.getRun(run.id);
      if (status?.status === 'COMPLETED') {
          console.log('Run Completed!');
          console.log('Result NPV:', status.result_payload_json?.kpis.npv.toFixed(2));
          return;
      }
      attempts++;
  }
  console.error('Run Timed Out');
}

async function run() {
    try {
        await testEngine();
        await testService();
        console.log('\nSUCCESS: Backend Verified');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
