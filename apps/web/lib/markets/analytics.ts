import {
    PriceSeries, ForwardCurve, Position, HedgeLink, AnalyticsResultEnvelope,
    ProvenanceRef, ConfidenceInterval, EmissionFactor, PricePoint
} from '@petrosquare/types';

// --- Math Helpers ---

const ERF_A1 = 0.254829592;
const ERF_A2 = -0.284496736;
const ERF_A3 = 1.421413741;
const ERF_A4 = -1.453152027;
const ERF_A5 = 1.061405429;
const ERF_P = 0.3275911;

function erf(x: number): number {
    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + ERF_P * x);
    const y = 1.0 - (((((ERF_A5 * t + ERF_A4) * t) + ERF_A3) * t + ERF_A2) * t + ERF_A1) * t * Math.exp(-x * x);
    return sign * y;
}

function stdNormalCDF(x: number): number {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function stdNormalPDF(x: number): number {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

// --- Derivatives (Black-Scholes) ---

export interface OptionParams {
    S: number; // Spot price
    K: number; // Strike price
    T: number; // Time to maturity (years)
    r: number; // Risk-free rate (decimal)
    sigma: number; // Volatility (decimal)
    type: 'CALL' | 'PUT';
    q?: number; // Dividend yield (decimal) - for commodities this is convenience yield
}

export interface Greeks {
    delta: number;
    gamma: number;
    vega: number;
    theta: number;
    rho: number;
    price: number;
}

export const DerivativesEngine = {
    priceOption(params: OptionParams): Greeks {
        const { S, K, T, r, sigma, type, q = 0 } = params;

        if (T <= 0) {
            // Expired
            const price = type === 'CALL' ? Math.max(0, S - K) : Math.max(0, K - S);
            return { price, delta: 0, gamma: 0, vega: 0, theta: 0, rho: 0 };
        }

        const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);

        const nd1 = stdNormalCDF(d1);
        const nd2 = stdNormalCDF(d2);
        const nnd1 = stdNormalPDF(d1); // n'(d1)

        let price = 0;
        let delta = 0;
        let theta = 0;
        let rho = 0;

        // Gamma and Vega are the same for Call and Put
        const gamma = (nnd1 * Math.exp(-q * T)) / (S * sigma * Math.sqrt(T));
        const vega = S * Math.exp(-q * T) * nnd1 * Math.sqrt(T) / 100; // Typically represented per 1% change

        if (type === 'CALL') {
            price = S * Math.exp(-q * T) * nd1 - K * Math.exp(-r * T) * nd2;
            delta = Math.exp(-q * T) * nd1;
            rho = K * T * Math.exp(-r * T) * nd2 / 100;
            theta = (- (S * sigma * Math.exp(-q * T) * nnd1) / (2 * Math.sqrt(T))
                     - r * K * Math.exp(-r * T) * nd2
                     + q * S * Math.exp(-q * T) * nd1) / 365;
        } else {
            const n_d1 = stdNormalCDF(-d1);
            const n_d2 = stdNormalCDF(-d2);
            price = K * Math.exp(-r * T) * n_d2 - S * Math.exp(-q * T) * n_d1;
            delta = -Math.exp(-q * T) * n_d1;
            rho = -K * T * Math.exp(-r * T) * n_d2 / 100;
            theta = (- (S * sigma * Math.exp(-q * T) * nnd1) / (2 * Math.sqrt(T))
                     + r * K * Math.exp(-r * T) * n_d2
                     - q * S * Math.exp(-q * T) * n_d1) / 365;
        }

        return { price, delta, gamma, vega, theta, rho };
    }
};

// --- Spreads & Arbitrage ---

export const SpreadsEngine = {
    computeSpread(seriesA: PricePoint[], seriesB: PricePoint[], multiplierA: number, multiplierB: number): { ts: string, value: number }[] {
        // Align by timestamp (simplified: assume sorted and matching dates for now, or use map)
        const mapB = new Map(seriesB.map(p => [p.ts.split('T')[0], p.price]));
        const spread: { ts: string, value: number }[] = [];

        for (const pA of seriesA) {
            const key = pA.ts.split('T')[0];
            const priceB = mapB.get(key);
            if (priceB !== undefined) {
                spread.push({
                    ts: pA.ts,
                    value: (pA.price * multiplierA) - (priceB * multiplierB)
                });
            }
        }
        return spread;
    },

    detectArbitrage(currentSpread: number, historicalMean: number, historicalStd: number, thresholdZ = 2.0): boolean {
        const zScore = Math.abs((currentSpread - historicalMean) / historicalStd);
        return zScore > thresholdZ;
    }
};

// --- Risk (VaR) ---

export const RiskEngine = {
    computeParametricVaR(positionValue: number, volatility: number, confidenceLevel = 0.95, days = 1): number {
        // Z-score for confidence
        // 0.95 -> 1.645
        // 0.99 -> 2.326
        const z = confidenceLevel === 0.95 ? 1.645 : confidenceLevel === 0.99 ? 2.326 : 1.96;
        return positionValue * z * volatility * Math.sqrt(days);
    },

    computeHistoricalVaR(returns: number[], confidenceLevel = 0.95): number {
        if (returns.length === 0) return 0;
        const sorted = [...returns].sort((a, b) => a - b);
        // Fix floating point issues by rounding to 4 decimals for the index calculation factor
        const alpha = Number((1 - confidenceLevel).toFixed(4));
        const index = Math.floor(alpha * sorted.length);
        return -sorted[Math.max(0, Math.min(index, sorted.length - 1))]; // VaR is typically positive loss
    },

    runStressTest(positionValue: number, shockPercent: number): number {
        return positionValue * (1 + shockPercent);
    }
};

// --- ESG ---

export const EsgEngine = {
    estimateEmissions(position: Position, factor: EmissionFactor): number {
        if (position.unit !== factor.unit) {
             // Simplified unit conversion check
             // In real app, use unit conversion lib
             console.warn(`Unit mismatch: ${position.unit} vs ${factor.unit}`);
        }
        return Math.abs(position.qty) * factor.factor;
    }
};
