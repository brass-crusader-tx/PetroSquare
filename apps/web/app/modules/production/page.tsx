"use client";

import React, { useState, useEffect } from 'react';
import {
  StandardPage,
  DataPanel,
  Badge,
  IntelligenceBlock,
  useDrawer,
  getStandardTabs
} from '@petrosquare/ui';
import { useData } from '@/lib/hooks';
import { TopProducersResponse } from '@petrosquare/types';
import Link from 'next/link';
import { MapPin, Activity } from 'lucide-react';

// Helper component for Tabbed content inside Drawer
function TabbedDrawerContent({ tabs }: { tabs: { id: string, label: string, content: React.ReactNode }[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-border bg-surface-highlight/5 shrink-0 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-white' : 'border-transparent text-muted hover:text-white'}`}
              >
                  {tab.label}
              </button>
          ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}

export default function ProductionPage() {
  const [country, setCountry] = useState<'US' | 'CA'>('US');
  const { data: regions, loading: loadingRegions } = useData<TopProducersResponse>(`/api/production/regions?country=${country}`);
  const { data: basins, loading: loadingBasins } = useData<any[]>('/api/production/basins');

  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const { openDrawer } = useDrawer();

  useEffect(() => {
      if (regions && !insight && !loadingInsight) {
          fetchInsight(regions);
      }
  }, [regions]);

  const fetchInsight = async (data: TopProducersResponse) => {
      setLoadingInsight(true);
      try {
          const prompt = `Analyze the production data for ${data.kind}.
          Top region: ${data.rows[0]?.region.name} with ${data.rows[0]?.latest_value} ${data.units}.
          Provide a brief executive summary on production trends.`;

          const res = await fetch('/api/ai/insight', { method: 'POST', body: JSON.stringify({ prompt }) });
          if (res.ok) {
            const json = await res.json();
            if (json.text) setInsight(json.text);
          }
      } catch(e) { console.error(e); } finally { setLoadingInsight(false); }
  }

  const handleBasinClick = (basinName: string, value: string) => {
    const tabs = getStandardTabs({ name: basinName, value, units: 'bbl/d' });
    openDrawer(
      <TabbedDrawerContent tabs={tabs} />,
      {
        title: `${basinName} Details`,
        subtitle: 'Basin Analysis',
        width: 500
      }
    );
  };

  const handleAIQuery = async (query: string) => {
    // Open a temporary drawer or show loading state
    // For now, we'll open a drawer with the AI result
    openDrawer(
      <div className="flex flex-col h-full">
         <div className="p-4 border-b border-border bg-surface-highlight/5">
            <div className="text-xs text-muted uppercase font-bold mb-1">Your Query</div>
            <div className="text-white italic">"{query}"</div>
         </div>
         <div className="flex-1 p-4">
             <IntelligenceBlock
               title="AI Response"
               insight="Analyzing your query..."
               loading={true}
             />
             {/* We would fetch the real response here */}
             <AIResponseLoader query={query} />
         </div>
      </div>,
      { title: "AI Assistant", subtitle: "PetroGPT-4-Turbo", width: 400 }
    );
  };

  return (
    <StandardPage
      header={{
        title: "Production & Reserves",
        subtitle: "Basin-level aggregates, decline curve analysis, and reserves reporting.",
        status: "active",
        actions: (
          <div className="flex space-x-1 bg-surface-highlight/10 p-1 rounded-lg border border-border">
            <button
              onClick={() => setCountry('US')}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${country === 'US' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-white'}`}
            >
              US
            </button>
            <button
              onClick={() => setCountry('CA')}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${country === 'CA' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-white'}`}
            >
              CA
            </button>
          </div>
        )
      }}
      aiContext="Production Overview"
      onAIQuery={handleAIQuery}
    >
        {/* AI Insight */}
        <IntelligenceBlock
          title="Production Intelligence"
          insight={insight || "Gathering production intelligence..."}
          loading={loadingInsight}
          confidence="high"
          sources={['EIA', 'Operator Reports', 'Internal Production DB']}
          assumptions={['Normal weather patterns', 'No major infrastructure outages']}
          className="mb-6"
        />

        {/* Priority Assets */}
        <div className="mb-6">
          <DataPanel title="Active Production Assets (Priority)" loading={false}>
              <div className="space-y-4">
                  <p className="text-sm text-muted mb-4">
                    Access advanced analytics, decline curve forecasting, anomaly detection, and scenario modeling for active assets.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/modules/production/asset/well-01" className="block p-4 bg-surface-highlight/10 rounded border border-border hover:border-primary/50 transition-colors group">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-white text-base group-hover:text-primary transition-colors flex items-center gap-2">
                                  Well 01
                                  <Badge status="live">Live</Badge>
                                </h4>
                                <div className="text-sm text-muted mt-1 flex items-center gap-2">
                                  <MapPin size={12} /> Permian Basin • Pioneer
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <div className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-muted">DCA Enabled</div>
                                  <div className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-muted">AI Anomalies</div>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end justify-between">
                                <div className="text-lg font-mono text-white">1,000 <span className="text-xs text-muted">bbl/d</span></div>
                                <div className="text-xs font-bold text-primary group-hover:underline mt-2">OPEN STUDIO &rarr;</div>
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center justify-center p-4 bg-surface-highlight/5 rounded border border-dashed border-border text-center h-full hover:bg-surface-highlight/10 transition-colors cursor-pointer" onClick={() => alert("Connector wizard would open here.")}>
                        <div>
                          <Activity size={24} className="mx-auto text-muted mb-2" />
                          <p className="text-sm text-white font-medium">Connect More Assets</p>
                          <p className="text-xs text-muted mt-1">OPC UA / WITSML / MQTT</p>
                        </div>
                    </div>
                  </div>
              </div>
          </DataPanel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Regional Production */}
          <DataPanel title={`Top Producing Regions (${country})`} loading={loadingRegions}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted uppercase bg-surface-highlight/10 border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Region</th>
                    <th className="px-4 py-3 text-right">Production ({regions?.units})</th>
                  </tr>
                </thead>
                <tbody>
                  {regions?.rows.map((row) => (
                    <tr
                      key={row.region.code}
                      className="border-b border-border hover:bg-surface-highlight/10 cursor-pointer transition-colors"
                      onClick={() => handleBasinClick(row.region.name, row.latest_value.toLocaleString())}
                    >
                      <td className="px-4 py-3 font-mono text-muted">#{row.rank}</td>
                      <td className="px-4 py-3 font-medium text-white">{row.region.name}</td>
                      <td className="px-4 py-3 text-right font-mono text-data-positive">
                        {row.latest_value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataPanel>

            {/* Right Column: Basins Overview */}
            <DataPanel title="Major Basins Overview" loading={loadingBasins}>
                <div className="space-y-3">
                    {basins?.map((basin: any) => (
                        <div
                          key={basin.name}
                          className="flex items-center justify-between p-3 bg-surface-highlight/10 rounded border border-border cursor-pointer hover:border-primary/50 hover:bg-surface-highlight/20 transition-all"
                          onClick={() => handleBasinClick(basin.name, basin.production.toLocaleString())}
                        >
                            <div>
                                <h4 className="font-bold text-white text-sm">{basin.name}</h4>
                                <div className="text-xs text-muted mt-1 flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-data-warning"></div>
                                  {basin.rigs} Active Rigs
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-mono text-white">{basin.production.toLocaleString()} <span className="text-xs text-muted">bbl/d</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </DataPanel>
        </div>
    </StandardPage>
  );
}

// Internal component to fetch and display AI response in the drawer
function AIResponseLoader({ query }: { query: string }) {
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAI = async () => {
            try {
                const res = await fetch('/api/ai/insight', {
                    method: 'POST',
                    body: JSON.stringify({ prompt: query })
                });
                const json = await res.json();
                setResponse(json.text || "No response generated.");
            } catch (e) {
                setResponse("Error connecting to AI service.");
            } finally {
                setLoading(false);
            }
        };
        fetchAI();
    }, [query]);

    if (loading) return null; // Parent shows loading state

    return (
        <IntelligenceBlock
            title="Analysis Complete"
            insight={response || ""}
            confidence="high"
            sources={['PetroSquare Data Fabric']}
            className="mt-4 animate-fade-in"
        />
    );
}
