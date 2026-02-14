import { db } from './db';
import {
    Regulation,
    RegulationVersion,
    Watchlist,
    WatchlistEvent,
    Assessment,
    Issue,
    Obligation
} from '@petrosquare/types';
import { randomUUID } from 'crypto';

export class RiskService {

    // --- Regulations ---

    async getRegulations(orgId: string, jurisdictionId?: string): Promise<Regulation[]> {
        const all = Array.from(db.regulations.values()).filter(r => r.org_id === orgId);
        if (jurisdictionId) {
            return all.filter(r => r.jurisdiction_id === jurisdictionId);
        }
        return all;
    }

    async getRegulation(orgId: string, id: string): Promise<Regulation | undefined> {
        const reg = db.regulations.get(id);
        if (reg && reg.org_id === orgId) return reg;
        return undefined;
    }

    async getRegulationVersions(orgId: string, id: string): Promise<RegulationVersion[]> {
        // Versions are child of Regulation, verify parent access first
        const reg = await this.getRegulation(orgId, id);
        if (!reg) return [];
        return db.regulationVersions.get(id) || [];
    }

    async createRegulation(orgId: string, reg: Omit<Regulation, 'id' | 'org_id' | 'created_at' | 'updated_at'>): Promise<Regulation> {
        const id = `reg-${randomUUID().split('-')[0]}`;
        const now = new Date().toISOString();
        const newReg: Regulation = {
            ...reg,
            id,
            org_id: orgId,
            created_at: now,
            updated_at: now
        };
        db.regulations.set(id, newReg);

        // Initial Version
        const version: RegulationVersion = {
            id: `ver-${id}-1`,
            regulation_id: id,
            version: 1,
            effective_date: reg.effective_date,
            changes_summary: 'Initial creation',
            full_text: reg.description, // MVP: use description as text
            created_at: now
        };
        db.regulationVersions.set(id, [version]);

        // Check watchlists
        await this.checkWatchlists(newReg, version, 'NEW_REGULATION');

        return newReg;
    }

    async updateRegulation(orgId: string, id: string, updates: Partial<Regulation>): Promise<Regulation> {
        const oldReg = await this.getRegulation(orgId, id);
        if (!oldReg) throw new Error(`Regulation ${id} not found`);

        const now = new Date().toISOString();
        // Prevent changing org_id
        const { org_id, ...validUpdates } = updates as any;
        const newReg: Regulation = { ...oldReg, ...validUpdates, updated_at: now };

        // Calculate Diff
        const changes: string[] = [];
        if (updates.title && updates.title !== oldReg.title) changes.push(`Title changed from "${oldReg.title}" to "${updates.title}"`);
        if (updates.description && updates.description !== oldReg.description) changes.push(`Description updated.`);
        if (updates.status && updates.status !== oldReg.status) changes.push(`Status changed to ${updates.status}`);
        if (updates.effective_date && updates.effective_date !== oldReg.effective_date) changes.push(`Effective date changed to ${updates.effective_date}`);

        if (changes.length > 0) {
            const versions = db.regulationVersions.get(id) || [];
            const newVersionNum = versions.length + 1;
            const version: RegulationVersion = {
                id: `ver-${id}-${newVersionNum}`,
                regulation_id: id,
                version: newVersionNum,
                effective_date: newReg.effective_date,
                changes_summary: changes.join('; '),
                full_text: newReg.description,
                created_at: now
            };
            db.regulationVersions.set(id, [...versions, version]);

            // Check watchlists
            await this.checkWatchlists(newReg, version, 'REGULATION_UPDATE');
        }

        db.regulations.set(id, newReg);
        return newReg;
    }

    // --- Watchlists ---

    async getWatchlists(orgId: string): Promise<Watchlist[]> {
        return Array.from(db.watchlists.values()).filter(w => w.org_id === orgId);
    }

    async createWatchlist(orgId: string, wl: Omit<Watchlist, 'id' | 'org_id' | 'created_at'>): Promise<Watchlist> {
        const id = `wl-${randomUUID().split('-')[0]}`;
        const newWl: Watchlist = {
            ...wl,
            id,
            org_id: orgId,
            created_at: new Date().toISOString()
        };
        db.watchlists.set(id, newWl);
        return newWl;
    }

    async getWatchlistEvents(orgId: string, watchlistId: string): Promise<WatchlistEvent[]> {
        const wl = db.watchlists.get(watchlistId);
        if (!wl || wl.org_id !== orgId) return [];
        return db.watchlistEvents.get(watchlistId) || [];
    }

    async getAllFeedEvents(orgId: string): Promise<WatchlistEvent[]> {
        // Filter events by watchlists belonging to org
        const orgWatchlistIds = new Set(Array.from(db.watchlists.values()).filter(w => w.org_id === orgId).map(w => w.id));
        return db.allWatchlistEvents
            .filter(e => orgWatchlistIds.has(e.watchlist_id))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    private async checkWatchlists(
        reg: Regulation,
        version: RegulationVersion,
        type: 'NEW_REGULATION' | 'REGULATION_UPDATE'
    ) {
        const watchlists = Array.from(db.watchlists.values());

        for (const wl of watchlists) {
            let match = false;

            // Check Jurisdiction
            if (wl.filters.jurisdiction_ids?.length) {
                if (wl.filters.jurisdiction_ids.includes(reg.jurisdiction_id)) {
                    match = true;
                }
            }

            // Check Keywords
            if (!match && wl.filters.keywords?.length) {
                const text = (reg.title + ' ' + reg.description).toLowerCase();
                if (wl.filters.keywords.some(k => text.includes(k.toLowerCase()))) {
                    match = true;
                }
            }

            if (match) {
                const event: WatchlistEvent = {
                    id: `evt-${randomUUID().split('-')[0]}`,
                    watchlist_id: wl.id,
                    regulation_id: reg.id,
                    regulation_version_id: version.id,
                    type,
                    summary: type === 'NEW_REGULATION'
                        ? `New regulation "${reg.title}" matches your watchlist.`
                        : `Regulation "${reg.title}" updated: ${version.changes_summary}`,
                    severity: 'MEDIUM', // detailed severity logic could go here
                    created_at: new Date().toISOString(),
                    is_read: false
                };

                const events = db.watchlistEvents.get(wl.id) || [];
                db.watchlistEvents.set(wl.id, [event, ...events]);
                db.allWatchlistEvents.unshift(event);
            }
        }
    }

    // --- Assessments & Issues ---

    async createAssessment(orgId: string, data: Omit<Assessment, 'id' | 'org_id' | 'created_at' | 'score'>): Promise<Assessment> {
        const id = `asm-${randomUUID().split('-')[0]}`;

        // Scoring Logic:
        // Base 100.
        // Status penalties: NON_COMPLIANT (-100), WARNING (-40).
        // Open Issues penalty: -10 per HIGH/CRITICAL issue.

        let score = 100;
        if (data.status === 'NON_COMPLIANT') score = 0;
        else if (data.status === 'WARNING') score = 60;
        else if (data.status === 'NOT_APPLICABLE') score = -1;

        // Fetch related issues to adjust score further?
        // For MVP creation, we assume no issues linked yet unless passed.
        // But let's check issues for the same asset/regulation if they exist.
        const existingIssues = await this.getIssues(orgId, data.asset_id);
        const relevantIssues = existingIssues.filter(i => i.obligation_id && i.status === 'OPEN');
        if (score > 0 && relevantIssues.length > 0) {
            score = Math.max(0, score - (relevantIssues.length * 10));
        }

        const assessment: Assessment = {
            ...data,
            id,
            org_id: orgId,
            score,
            assessed_at: new Date().toISOString()
        };
        db.assessments.set(id, assessment);
        return assessment;
    }

    async getAssessments(orgId: string, assetId?: string): Promise<Assessment[]> {
        const all = Array.from(db.assessments.values()).filter(a => a.org_id === orgId);
        if (assetId) return all.filter(a => a.asset_id === assetId);
        return all;
    }

    async createIssue(orgId: string, data: Omit<Issue, 'id' | 'org_id' | 'created_at' | 'updated_at'>): Promise<Issue> {
        const id = `iss-${randomUUID().split('-')[0]}`;
        const now = new Date().toISOString();
        const issue: Issue = {
            ...data,
            id,
            org_id: orgId,
            created_at: now,
            updated_at: now
        };
        db.issues.set(id, issue);
        return issue;
    }

    async getIssues(orgId: string, assetId?: string): Promise<Issue[]> {
        const all = Array.from(db.issues.values()).filter(i => i.org_id === orgId);
        if (assetId) return all.filter(i => i.asset_id === assetId);
        return all;
    }

    // --- Jurisdictions & Obligations ---

    async getJurisdictions() {
        return Array.from(db.jurisdictions.values());
    }

    async getObligations(orgId: string) {
        return Array.from(db.obligations.values()).filter(o => o.org_id === orgId);
    }
}

export const riskService = new RiskService();
