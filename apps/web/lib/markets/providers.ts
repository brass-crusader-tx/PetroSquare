import { Instrument, PriceSeries, ForwardCurve, PricePoint, ForwardCurvePoint, ProvenanceRef } from '@petrosquare/types';

export interface MarketDataProvider {
    searchInstruments(query: string): Promise<Instrument[]>;
    getLatestPrice(instrumentId: string): Promise<{ price: number; asOf: string; provenance: ProvenanceRef }>;
    getSpotSeries(instrumentId: string, start: string, end: string, granularity: 'TICK' | '1M' | '1H' | '1D'): Promise<PriceSeries>;
    getForwardCurve(instrumentId: string, asOf?: string): Promise<ForwardCurve>;
}

// Helper for sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockMarketDataProvider implements MarketDataProvider {
    private latencyMs: number = 100;
    private failureRate: number = 0.0; // 0% failure for now, can be bumped for testing

    constructor(latencyMs = 100, failureRate = 0.0) {
        this.latencyMs = latencyMs;
        this.failureRate = failureRate;
    }

    private async simulateNetwork() {
        await sleep(this.latencyMs + Math.random() * 50);
        if (Math.random() < this.failureRate) {
            throw new Error("Market Data Provider Error: Connection Timeout");
        }
    }

    async searchInstruments(query: string): Promise<Instrument[]> {
        await this.simulateNetwork();
        // Mock Instruments
        const instruments: Instrument[] = [
            { id: 'cl-fut', type: 'CRUDE', symbol: 'CL', name: 'WTI Crude Futures', region: 'US', unit: 'bbl', currency: 'USD', timezone: 'America/New_York' },
            { id: 'bb-fut', type: 'CRUDE', symbol: 'BB', name: 'Brent Crude Futures', region: 'UK', unit: 'bbl', currency: 'USD', timezone: 'Europe/London' },
            { id: 'ng-fut', type: 'NATGAS', symbol: 'NG', name: 'Henry Hub Natural Gas', region: 'US', unit: 'MMBtu', currency: 'USD', timezone: 'America/New_York' },
            { id: 'rb-fut', type: 'REFINED', symbol: 'RB', name: 'RBOB Gasoline', region: 'US', unit: 'gal', currency: 'USD', timezone: 'America/New_York' },
            { id: 'ho-fut', type: 'REFINED', symbol: 'HO', name: 'Heating Oil', region: 'US', unit: 'gal', currency: 'USD', timezone: 'America/New_York' },
        ];

        if (!query) return instruments;
        const lowerQ = query.toLowerCase();
        return instruments.filter(i =>
            i.symbol.toLowerCase().includes(lowerQ) ||
            i.name.toLowerCase().includes(lowerQ)
        );
    }

    async getLatestPrice(instrumentId: string): Promise<{ price: number; asOf: string; provenance: ProvenanceRef }> {
        await this.simulateNetwork();
        // Deterministic random based on ID
        const base = instrumentId.includes('cl') ? 75 : instrumentId.includes('bb') ? 80 : instrumentId.includes('ng') ? 2.5 : 2.2;
        const volatility = base * 0.02;
        const price = base + (Math.random() - 0.5) * volatility;

        return {
            price,
            asOf: new Date().toISOString(),
            provenance: {
                sourceSystem: 'MockProvider',
                sourceType: 'INTERNAL',
                ingestedAt: new Date().toISOString(),
                asOf: new Date().toISOString(),
                notes: 'Simulated realtime price'
            }
        };
    }

    async getSpotSeries(instrumentId: string, start: string, end: string, granularity: 'TICK' | '1M' | '1H' | '1D'): Promise<PriceSeries> {
        await this.simulateNetwork();
        const startDate = new Date(start);
        const endDate = new Date(end);
        const points: PricePoint[] = [];

        // Base price
        let currentPrice = instrumentId.includes('cl') ? 75 : instrumentId.includes('bb') ? 80 : 2.5;

        // Iterate days (simplified)
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            // Random walk
            currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.03);
            points.push({
                instrumentId,
                ts: d.toISOString(),
                price: currentPrice,
                unit: 'USD',
                currency: 'USD',
                source: 'MockProvider',
                qualityFlags: ['OK']
            });
        }

        return {
            instrumentId,
            granularity,
            points
        };
    }

    async getForwardCurve(instrumentId: string, asOf?: string): Promise<ForwardCurve> {
        await this.simulateNetwork();
        const basePrice = instrumentId.includes('cl') ? 75 : 80;
        const points: ForwardCurvePoint[] = [];
        const today = new Date();

        // Generate 12 months forward
        for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
            // Slight backwardation
            const price = basePrice - (i * 0.2) + (Math.random() * 0.1);

            points.push({
                instrumentId,
                deliveryStart: d.toISOString(),
                deliveryEnd: new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString(),
                price,
                unit: 'USD',
                currency: 'USD',
                asOf: asOf || new Date().toISOString()
            });
        }

        return {
            instrumentId,
            asOf: asOf || new Date().toISOString(),
            points
        };
    }
}
