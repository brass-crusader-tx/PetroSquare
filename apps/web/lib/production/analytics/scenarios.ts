import { Scenario, TimeSeriesPoint } from '@petrosquare/types';
import { db } from '../db';

// Simple UUID generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class ScenarioService {
  /**
   * Applies scenario modifications to a base forecast series.
   * @param baseSeries The original forecast series (e.g. from DCA base model)
   * @param scenario The scenario containing modifications
   */
  static apply(baseSeries: TimeSeriesPoint[], scenario: Scenario): TimeSeriesPoint[] {
    const mods = scenario.modifications || {};

    // Downtime: Simple count of days per month
    // Format: YYYY-MM-DD
    const downtimeByMonth: Record<string, number> = {};
    (mods.downtime_days || []).forEach(d => {
        const month = d.slice(0, 7); // YYYY-MM
        downtimeByMonth[month] = (downtimeByMonth[month] || 0) + 1;
    });

    return baseSeries.map(point => {
      let value = point.value;
      const dateStr = point.period; // YYYY-MM

      // 1. Downtime
      const daysDown = downtimeByMonth[dateStr] || 0;
      if (daysDown > 0) {
          // Assume 30 days per month
          const factor = Math.max(0, 1 - (daysDown / 30));
          value *= factor;
      }

      // 2. Curtailment
      if (mods.curtailment_percent) {
        value *= (1 - mods.curtailment_percent / 100);
      }

      // 3. Uplift
      if (mods.uplift_multiplier) {
        value *= mods.uplift_multiplier;
      }

      // 4. Decline Rate Multiplier
      // Usually applied during generation, but if we modify *post* generation:
      // If we want steeper decline, we decay the value *further* based on time index?
      // Too complex for post-processing without t.
      // We assume decline_rate_multiplier is handled by re-generating the curve with new parameters,
      // and this function only handles "events".
      // But if we MUST handle it here:
      if (mods.decline_rate_multiplier && mods.decline_rate_multiplier !== 1) {
          // This is hard without t. We'll skip for now.
      }

      return {
        period: point.period,
        value: value
      };
    });
  }

  static async create(assetId: string, name: string, baseId?: string): Promise<Scenario> {
    const scenario: Scenario = {
      id: generateId(),
      asset_id: assetId,
      name: name,
      base_scenario_id: baseId,
      modifications: {},
      is_committed: false,
      created_at: new Date().toISOString(),
      created_by: 'user'
    };
    await db.createScenario(scenario);
    return scenario;
  }
}
