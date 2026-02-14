import { Instrument, PriceSeries, ForwardCurve, PricePoint, Position, HedgeLink, MarketEvent, ScenarioRun, AnalyticsResultEnvelope, ProvenanceRef } from '@petrosquare/types';
import { MockMarketDataProvider } from './providers';

// --- In-Memory Stores ---

const instrumentStore = new Map<string, Instrument>();
const priceStore = new Map<string, PricePoint[]>(); // Key: instrumentId
const curveStore = new Map<string, ForwardCurve>(); // Key: instrumentId
const positionStore = new Map<string, Position>();
const hedgeStore = new Map<string, HedgeLink[]>(); // Key: physicalPositionId
const eventStore: MarketEvent[] = [];
const scenarioStore = new Map<string, ScenarioRun>();

// Initialize with some data
const provider = new MockMarketDataProvider();

// --- Initialization Logic ---
export async function initializeMarketData() {
    if (instrumentStore.size > 0) return; // Already initialized

    const instruments = await provider.searchInstruments("");
    for (const inst of instruments) {
        instrumentStore.set(inst.id, inst);

        // Seed initial prices
        const series = await provider.getSpotSeries(inst.id,
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            new Date().toISOString(),
            '1D'
        );
        priceStore.set(inst.id, series.points);

        // Seed curve
        const curve = await provider.getForwardCurve(inst.id);
        curveStore.set(inst.id, curve);
    }

    // Seed some positions
    const pos1: Position = {
        id: 'pos-phys-1',
        book: 'Crude Trading',
        strategy: 'Physical Arb',
        instrumentId: 'cl-fut',
        type: 'PHYSICAL',
        qty: 10000,
        unit: 'bbl',
        avgPrice: 74.50,
        currency: 'USD',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['WTI', 'Permian']
    };
    positionStore.set(pos1.id, pos1);

    const pos2: Position = {
        id: 'pos-fin-1',
        book: 'Crude Trading',
        strategy: 'Physical Arb',
        instrumentId: 'cl-fut',
        type: 'FINANCIAL',
        qty: -10000,
        unit: 'bbl',
        avgPrice: 75.10,
        currency: 'USD',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['Hedge', 'Short']
    };
    positionStore.set(pos2.id, pos2);

    // Link them
    const link: HedgeLink = {
        id: 'link-1',
        physicalPositionId: pos1.id,
        hedgePositionId: pos2.id,
        hedgeRatio: 1.0,
        rationale: 'Perfect hedge for physical delivery',
        createdBy: 'system',
        createdAt: new Date().toISOString()
    };
    hedgeStore.set(pos1.id, [link]);
}

// --- Data Accessors ---

export const MarketDataService = {
    async getInstruments(query?: string): Promise<Instrument[]> {
        await initializeMarketData();
        const all = Array.from(instrumentStore.values());
        if (!query) return all;
        const lowerQ = query.toLowerCase();
        return all.filter(i => i.symbol.toLowerCase().includes(lowerQ) || i.name.toLowerCase().includes(lowerQ));
    },

    async getInstrument(id: string): Promise<Instrument | undefined> {
        await initializeMarketData();
        return instrumentStore.get(id);
    },

    async getLatestPrice(id: string): Promise<PricePoint | undefined> {
        await initializeMarketData();
        // Try to fetch live from provider first for freshness
        try {
            const live = await provider.getLatestPrice(id);
            return {
                instrumentId: id,
                ts: live.asOf,
                price: live.price,
                unit: 'USD', // Simplified
                currency: 'USD',
                source: 'LiveProvider',
                qualityFlags: ['REALTIME']
            };
        } catch (e) {
            // Fallback to stored
            const points = priceStore.get(id);
            return points ? points[points.length - 1] : undefined;
        }
    },

    async getPriceSeries(id: string): Promise<PricePoint[]> {
        await initializeMarketData();
        return priceStore.get(id) || [];
    },

    async getForwardCurve(id: string): Promise<ForwardCurve | undefined> {
        await initializeMarketData();
        return curveStore.get(id);
    },

    // --- Positions ---

    async getPositions(): Promise<Position[]> {
        await initializeMarketData();
        return Array.from(positionStore.values());
    },

    async getPosition(id: string): Promise<Position | undefined> {
        return positionStore.get(id);
    },

    async createPosition(pos: Position): Promise<Position> {
        positionStore.set(pos.id, pos);
        return pos;
    },

    async getHedges(physicalPositionId: string): Promise<HedgeLink[]> {
        return hedgeStore.get(physicalPositionId) || [];
    },

    async linkHedge(link: HedgeLink): Promise<HedgeLink> {
        const existing = hedgeStore.get(link.physicalPositionId) || [];
        existing.push(link);
        hedgeStore.set(link.physicalPositionId, existing);
        return link;
    },

    // --- Events ---

    async getEvents(): Promise<MarketEvent[]> {
        return eventStore;
    },

    async addEvent(event: MarketEvent) {
        eventStore.push(event);
    },

    // --- Sandbox / Scenarios ---

    async createScenarioRun(run: ScenarioRun): Promise<ScenarioRun> {
        scenarioStore.set(run.id, run);
        return run;
    },

    async getScenarioRun(id: string): Promise<ScenarioRun | undefined> {
        return scenarioStore.get(id);
    },

    async listScenarioRuns(): Promise<ScenarioRun[]> {
        return Array.from(scenarioStore.values());
    }
};
