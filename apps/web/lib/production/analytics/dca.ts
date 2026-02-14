import { ProductionSeries, DcaModel, TimeSeriesPoint } from '@petrosquare/types';

// Simple UUID generator to avoid node/browser crypto discrepancies
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface DcaStrategy {
  fit(data: TimeSeriesPoint[]): DcaModel;
  forecast(model: DcaModel, startDate: Date, months: number): TimeSeriesPoint[];
}

export class ExponentialDca implements DcaStrategy {
  fit(data: TimeSeriesPoint[]): DcaModel {
    if (data.length < 2) throw new Error("Insufficient data for DCA fit");

    // Convert TimeSeriesPoint[] to simple array of {t, q}
    // Assume data is sorted by date.
    const start = new Date(data[0].period).getTime();
    const points = data.map(p => ({
      t: (new Date(p.period).getTime() - start) / (1000 * 3600 * 24), // days
      q: Math.max(0.1, p.value) // avoid log(0)
    }));

    const n = points.length;
    let sumT = 0, sumLnQ = 0, sumT2 = 0, sumTLnQ = 0;

    points.forEach(p => {
      const lnQ = Math.log(p.q);
      sumT += p.t;
      sumLnQ += lnQ;
      sumT2 += p.t * p.t;
      sumTLnQ += p.t * lnQ;
    });

    const denominator = (n * sumT2 - sumT * sumT);
    // If denominator is 0, all t are same? Handle gracefully.
    if (Math.abs(denominator) < 1e-9) {
        throw new Error("Cannot fit DCA: Singular matrix (all points at same time?)");
    }

    const slope = (n * sumTLnQ - sumT * sumLnQ) / denominator; // -di
    const intercept = (sumLnQ - slope * sumT) / n; // ln(qi)

    // We want the model to be valid for forecasting from the END of the data.
    // So we project qi to the last data point time.
    // The fit gave us qi at t=0 (start of data).
    // Let's call it qi_start.
    const qi_start = Math.exp(intercept);
    const di = -slope; // Daily nominal decline rate (exponential)

    // Project qi to end of data (t = last point t)
    const t_end = points[points.length - 1].t;
    const qi = qi_start * Math.exp(-di * t_end);

    // Calculate R2
    const meanLnQ = sumLnQ / n;
    let ssTot = 0, ssRes = 0;
    points.forEach(p => {
        const lnQ = Math.log(p.q);
        const predictedLnQ = intercept + slope * p.t;
        ssTot += Math.pow(lnQ - meanLnQ, 2);
        ssRes += Math.pow(lnQ - predictedLnQ, 2);
    });

    // Avoid division by zero if all values are same
    const r2 = ssTot < 1e-9 ? 1 : 1 - (ssRes / ssTot);
    const rmse = Math.sqrt(ssRes / n);

    return {
      id: generateId(),
      asset_id: 'temp',
      type: 'EXPONENTIAL',
      params: { qi, di, b: 0 },
      goodness_of_fit: { r2, rmse },
      created_at: new Date().toISOString()
    };
  }

  forecast(model: DcaModel, startDate: Date, months: number): TimeSeriesPoint[] {
    const points: TimeSeriesPoint[] = [];
    const qi = model.params.qi;
    const di = model.params.di;

    // We assume startDate corresponds to t=0 for the forecast relative to the model's Qi
    // If model was fit on past data, we need to project from the end of history.
    // But usually forecast starts from "now" using current rate as Qi.
    // Here we assume 'model' parameters are valid for 'startDate' as t=0.

    for (let i = 0; i < months; i++) {
        // Simple monthly points
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);

        // Time in days from start
        const t = (date.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

        const q = qi * Math.exp(-di * t);

        points.push({
            period: date.toISOString().slice(0, 7), // YYYY-MM
            value: q
        });
    }
    return points;
  }
}

export class HyperbolicDca implements DcaStrategy {
    fit(data: TimeSeriesPoint[]): DcaModel {
        // Fallback to Exponential fit + small b for MVP
        // Real hyperbolic fitting requires non-linear optimization (Levenberg-Marquardt)
        const expStrategy = new ExponentialDca();
        const expModel = expStrategy.fit(data);

        return {
            ...expModel,
            type: 'HYPERBOLIC',
            params: { ...expModel.params, b: 0.1 } // b=0.1
        };
    }

    forecast(model: DcaModel, startDate: Date, months: number): TimeSeriesPoint[] {
        const points: TimeSeriesPoint[] = [];
        const qi = model.params.qi;
        const di = model.params.di;
        const b = model.params.b || 0;

        if (Math.abs(b) < 0.001) {
             const expStrategy = new ExponentialDca();
             return expStrategy.forecast(model, startDate, months);
        }

        for (let i = 0; i < months; i++) {
            const date = new Date(startDate);
            date.setMonth(date.getMonth() + i);
            const t = (date.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

            // Hyperbolic: q = qi / (1 + b * di * t)^(1/b)
            // Note: di here is initial nominal decline rate
            const base = 1 + b * di * t;
            const q = qi / Math.pow(base, 1/b);

            points.push({
                period: date.toISOString().slice(0, 7),
                value: q
            });
        }
        return points;
    }
}
