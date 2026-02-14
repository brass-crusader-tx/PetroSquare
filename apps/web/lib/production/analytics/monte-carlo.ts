import { DcaModel, TimeSeriesPoint } from '@petrosquare/types';
import { ExponentialDca, HyperbolicDca } from './dca';

export interface MonteCarloResult {
  p10: TimeSeriesPoint[];
  p50: TimeSeriesPoint[];
  p90: TimeSeriesPoint[];
  iterations: number;
}

export class MonteCarloSimulation {
  static run(model: DcaModel, iterations: number, horizonMonths: number): { p10: TimeSeriesPoint[], p50: TimeSeriesPoint[], p90: TimeSeriesPoint[] } {
    const forecasts: TimeSeriesPoint[][] = [];

    // Choose strategy
    const strategy = model.type === 'HYPERBOLIC' ? new HyperbolicDca() : new ExponentialDca();

    // Start date for forecast
    const startDate = new Date();

    for (let i = 0; i < iterations; i++) {
        // Perturb parameters
        // Simple uniform distribution +/- 10%
        const qi_var = model.params.qi * (1 + (Math.random() - 0.5) * 0.2);
        const di_var = model.params.di * (1 + (Math.random() - 0.5) * 0.2);
        let b_var = model.params.b;
        if (b_var !== undefined) {
             b_var = b_var * (1 + (Math.random() - 0.5) * 0.2);
        }

        const iterModel: DcaModel = {
            ...model,
            params: {
                ...model.params,
                qi: qi_var,
                di: di_var,
                b: b_var
            }
        };

        forecasts.push(strategy.forecast(iterModel, startDate, horizonMonths));
    }

    const p10: TimeSeriesPoint[] = [];
    const p50: TimeSeriesPoint[] = [];
    const p90: TimeSeriesPoint[] = [];

    if (forecasts.length === 0 || forecasts[0].length === 0) {
        return { p10: [], p50: [], p90: [] };
    }

    const numMonths = forecasts[0].length;

    for (let m = 0; m < numMonths; m++) {
        const valuesAtMonth = forecasts.map(f => f[m].value).sort((a, b) => a - b);

        // P10: 10% probability of being LESS than this value? Or 90% chance of exceeding?
        // In Oil & Gas:
        // P90 = Conservative (90% probability actual >= estimate) -> Lower value
        // P50 = Median
        // P10 = Optimistic (10% probability actual >= estimate) -> Higher value

        // If sorting ascending:
        // Index 0 is min, Index N is max.
        // P90 (conservative) is at index 0.1 * N (low value)
        // P10 (optimistic) is at index 0.9 * N (high value)

        const idxP90 = Math.floor(iterations * 0.1);
        const idxP50 = Math.floor(iterations * 0.5);
        const idxP10 = Math.floor(iterations * 0.9);

        const period = forecasts[0][m].period;

        p90.push({ period, value: valuesAtMonth[idxP90] });
        p50.push({ period, value: valuesAtMonth[idxP50] });
        p10.push({ period, value: valuesAtMonth[idxP10] });
    }

    return { p10, p50, p90 };
  }
}
