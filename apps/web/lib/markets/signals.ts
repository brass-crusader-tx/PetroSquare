import { MarketEvent } from '@petrosquare/types';

export const SignalsEngine = {
    assessImpact(event: MarketEvent): MarketEvent {
        // Simple heuristic: Keyword matching
        const text = (event.title + " " + event.summary).toLowerCase();
        const impacts: string[] = [];
        let confidence = 0.5;

        if (text.includes('crude') || text.includes('oil')) {
            impacts.push('cl-fut', 'bb-fut');
            confidence += 0.2;
        }
        if (text.includes('gas') || text.includes('lng')) {
            impacts.push('ng-fut');
            confidence += 0.2;
        }
        if (text.includes('hurricane') || text.includes('storm')) {
            confidence += 0.1;
        }
        if (text.includes('sanction') || text.includes('war')) {
            confidence += 0.2;
        }

        return {
            ...event,
            impact: {
                instrumentIds: impacts,
                description: impacts.length > 0 ? `Potential impact on ${impacts.join(', ')}` : 'No direct market impact detected',
                confidence: Math.min(0.95, confidence)
            }
        };
    }
};

export const MockNewsEventProvider = {
    async fetchLatestEvents(): Promise<MarketEvent[]> {
        return [
            {
                id: 'evt-news-1',
                ts: new Date().toISOString(),
                title: 'OPEC+ Surprise Cut',
                summary: 'OPEC+ announces a voluntary production cut of 1.0 mbpd starting next month.',
                regions: ['Global', 'Middle East'],
                commodities: ['CRUDE'],
                severity: 'HIGH',
                tags: ['Geopolitics', 'Supply'],
                source: 'Reuters',
                urlRef: 'https://reuters.com/example'
            },
            {
                id: 'evt-news-2',
                ts: new Date(Date.now() - 3600000).toISOString(),
                title: 'US LNG Export Terminal Maintenance',
                summary: 'Freeport LNG announces 2 week maintenance shutdown.',
                regions: ['US', 'Gulf Coast'],
                commodities: ['NATGAS'],
                severity: 'MEDIUM',
                tags: ['Infrastructure', 'Supply'],
                source: 'Bloomberg',
                urlRef: 'https://bloomberg.com/example'
            }
        ];
    }
};
