import React, { useState } from 'react';
import { DataPanel, Badge, Button } from '@petrosquare/ui';
import { Watchlist, WatchlistEvent } from '@petrosquare/types';
import { useData } from '../../../../lib/hooks';

export function WatchlistManager() {
    const { data: watchlists, loading: loadingLists, refresh } = useData<Watchlist[]>('/api/risk/watchlists');
    const [selectedList, setSelectedList] = useState<Watchlist | null>(null);

    // Fetch events for selected list
    // Note: useData hook might need to be conditional or we fetch on click.
    // For simplicity, we'll fetch all events for the selected list if one is selected.

    // We'll simulate fetching events for selected list by filtering global feed or using specific endpoint
    // Ideally we use a new hook instance when selectedList changes
    const { data: listEvents, loading: loadingEvents } = useData<WatchlistEvent[]>(
        selectedList ? `/api/risk/watchlists/${selectedList.id}/events` : null
    );

    const handleCreate = async () => {
        // MVP: Just create a dummy watchlist for demonstration
        const name = prompt("Enter Watchlist Name:");
        if (!name) return;

        await fetch('/api/risk/watchlists', {
            method: 'POST',
            body: JSON.stringify({
                name,
                filters: { jurisdiction_ids: ['us-fed'], keywords: [] },
                created_by: 'user'
            })
        });
        refresh();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* List of Watchlists */}
            <div className="col-span-1">
                <DataPanel title="Your Watchlists" action={<Button onClick={handleCreate}>+ New</Button>}>
                    <div className="space-y-2">
                        {watchlists?.map(wl => (
                            <div
                                key={wl.id}
                                onClick={() => setSelectedList(wl)}
                                className={`p-3 rounded border cursor-pointer transition-colors ${selectedList?.id === wl.id ? 'bg-primary/20 border-primary' : 'bg-surface-highlight/10 border-border hover:bg-surface-highlight/20'}`}
                            >
                                <div className="font-medium text-white">{wl.name}</div>
                                <div className="text-xs text-muted mt-1 truncate">{wl.description || 'No description'}</div>
                                <div className="flex gap-1 mt-2 flex-wrap">
                                    {wl.filters.jurisdiction_ids?.map(id => (
                                        <span key={id} className="text-[10px] bg-surface-highlight px-1.5 rounded text-muted font-mono">{id}</span>
                                    ))}
                                    {wl.filters.keywords?.map(k => (
                                        <span key={k} className="text-[10px] bg-surface-highlight px-1.5 rounded text-muted font-mono">"{k}"</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DataPanel>
            </div>

            {/* Events for Selected List */}
            <div className="col-span-2">
                <DataPanel title={selectedList ? `Events: ${selectedList.name}` : "Select a Watchlist"} loading={loadingEvents}>
                    {selectedList ? (
                        <div className="space-y-4">
                            {listEvents?.map(e => (
                                <div key={e.id} className="border-b border-border pb-3 last:border-0">
                                    <div className="flex justify-between">
                                        <Badge status={e.severity === 'HIGH' ? 'critical' : 'live'}>{e.type}</Badge>
                                        <span className="text-xs text-muted font-mono">{new Date(e.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-white mt-2">{e.summary}</p>
                                </div>
                            ))}
                            {!loadingEvents && (!listEvents || listEvents.length === 0) && (
                                <div className="text-muted text-sm py-10 text-center">No events found for this watchlist.</div>
                            )}
                        </div>
                    ) : (
                        <div className="text-muted text-sm py-10 text-center">Select a watchlist to view filtered events.</div>
                    )}
                </DataPanel>
            </div>
        </div>
    );
}
