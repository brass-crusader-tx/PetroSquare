import {
    Jurisdiction,
    Regulation,
    RegulationVersion,
    Obligation,
    Control,
    Assessment,
    Issue,
    Watchlist,
    WatchlistEvent
} from '@petrosquare/types';

class RiskRepository {
    private static instance: RiskRepository;

    public jurisdictions: Map<string, Jurisdiction> = new Map();
    public regulations: Map<string, Regulation> = new Map();
    public regulationVersions: Map<string, RegulationVersion[]> = new Map(); // key: regulation_id
    public obligations: Map<string, Obligation> = new Map();
    public controls: Map<string, Control> = new Map();
    public assessments: Map<string, Assessment> = new Map();
    public issues: Map<string, Issue> = new Map();
    public watchlists: Map<string, Watchlist> = new Map();
    public watchlistEvents: Map<string, WatchlistEvent[]> = new Map(); // key: watchlist_id or just a flat list? Better by ID for query.

    // Also need a way to get ALL events across watchlists for the feed
    public allWatchlistEvents: WatchlistEvent[] = [];

    private constructor() {
        this.seedData();
    }

    static getInstance(): RiskRepository {
        if (!RiskRepository.instance) {
            RiskRepository.instance = new RiskRepository();
        }
        return RiskRepository.instance;
    }

    public seedData() {
        const now = new Date().toISOString();

        // 1. Jurisdictions
        const usFed: Jurisdiction = { id: 'us-fed', name: 'United States (Federal)', code: 'US', type: 'COUNTRY' };
        const usTx: Jurisdiction = { id: 'us-tx', name: 'Texas', code: 'US-TX', type: 'STATE', parent_id: 'us-fed' };
        const usNm: Jurisdiction = { id: 'us-nm', name: 'New Mexico', code: 'US-NM', type: 'STATE', parent_id: 'us-fed' };

        this.jurisdictions.set(usFed.id, usFed);
        this.jurisdictions.set(usTx.id, usTx);
        this.jurisdictions.set(usNm.id, usNm);

        // 2. Regulations
        const regCaa: Regulation = {
            id: 'reg-caa',
            org_id: 'org-demo',
            jurisdiction_id: 'us-fed',
            title: 'Clean Air Act (CAA)',
            description: 'Comprehensive federal law that regulates air emissions from stationary and mobile sources.',
            status: 'active',
            effective_date: '1970-12-31',
            created_at: now,
            updated_at: now
        };

        const regMerp: Regulation = {
            id: 'reg-merp',
            org_id: 'org-demo',
            jurisdiction_id: 'us-fed',
            title: 'Methane Emissions Reduction Program (MERP)',
            description: 'Proposed rule to reduce methane emissions from the oil and natural gas sector.',
            status: 'pending',
            effective_date: '2024-01-01',
            created_at: now,
            updated_at: now
        };

        this.regulations.set(regCaa.id, regCaa);
        this.regulations.set(regMerp.id, regMerp);

        // Versions
        this.regulationVersions.set(regCaa.id, [{
            id: 'ver-caa-1',
            regulation_id: 'reg-caa',
            version: 1,
            effective_date: '1970-12-31',
            changes_summary: 'Initial enactment.',
            full_text: 'The Clean Air Act is the United States primary federal air quality law...',
            created_at: now
        }]);

        // 3. Obligations
        const oblFlare: Obligation = {
            id: 'obl-flare',
            org_id: 'org-demo',
            regulation_id: 'reg-merp',
            title: 'Flare Monitoring',
            description: 'Continuous monitoring of flare stack efficiency.',
            frequency: 'DAILY'
        };

        const oblLeak: Obligation = {
            id: 'obl-leak',
            org_id: 'org-demo',
            regulation_id: 'reg-merp',
            title: 'Leak Detection and Repair (LDAR)',
            description: 'Quarterly surveys of all well sites for methane leaks.',
            frequency: 'QUARTERLY'
        };

        this.obligations.set(oblFlare.id, oblFlare);
        this.obligations.set(oblLeak.id, oblLeak);

        // 4. Watchlists
        const wlEnv: Watchlist = {
            id: 'wl-env',
            org_id: 'org-demo',
            name: 'Environmental Compliance',
            description: 'Tracking environmental regulations in active basins.',
            filters: {
                jurisdiction_ids: ['us-fed', 'us-tx'],
                keywords: ['methane', 'emissions', 'water']
            },
            created_by: 'system',
            created_at: now
        };

        this.watchlists.set(wlEnv.id, wlEnv);

        // 5. Watchlist Events (Seed one)
        const event1: WatchlistEvent = {
            id: 'evt-1',
            watchlist_id: 'wl-env',
            regulation_id: 'reg-merp',
            type: 'NEW_REGULATION',
            summary: 'New regulation "Methane Emissions Reduction Program" matches your filters.',
            severity: 'HIGH',
            created_at: now,
            is_read: false
        };

        this.watchlistEvents.set(wlEnv.id, [event1]);
        this.allWatchlistEvents.push(event1);
    }
}

const globalForRisk = global as unknown as { riskDb: RiskRepository };

export const db = globalForRisk.riskDb || RiskRepository.getInstance();

if (process.env.NODE_ENV !== 'production') globalForRisk.riskDb = db;
