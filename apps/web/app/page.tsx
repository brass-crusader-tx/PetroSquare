"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AppLayout,
  PageContainer,
  SectionHeader,
  DataPanel,
  Badge,
  KpiCard,
  DetailDrawer
} from "@petrosquare/ui";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeKpi, setActiveKpi] = useState<string | null>(null);

  const handleKpiClick = (kpi: string) => {
    setActiveKpi(kpi);
    setDrawerOpen(true);
  };

  return (
    <AppLayout currentPath="/">
      <PageContainer>
        <SectionHeader
          title="Control Center"
          description="Operational overview and system health monitoring."
        >
             <div className="flex items-center space-x-4">
                 <Badge status="live">System Active</Badge>
                 <span className="text-muted text-xs font-mono">v1.0.0</span>
             </div>
        </SectionHeader>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
                label="Global Production"
                value="2.4M bbl/d"
                trend="positive"
                onClick={() => handleKpiClick('Production')}
            />
            <KpiCard
                label="WTI Crude"
                value="$76.42"
                trend="positive"
                onClick={() => handleKpiClick('Markets')}
            />
            <KpiCard
                label="Active Alerts"
                value="3"
                trend="negative"
                onClick={() => handleKpiClick('Risk')}
            />
            <KpiCard
                label="System Uptime"
                value="99.98%"
                trend="neutral"
                onClick={() => handleKpiClick('System')}
            />
        </div>

        {/* Capabilities Grid */}
        <section className="mb-12">
          <SectionHeader
            title="Operational Modules"
            description="Select a domain module to access its workspace."
            className="mb-6"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/modules/production" className="group">
              <DataPanel title="Production & Reserves" className="h-full group-hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-muted text-sm leading-relaxed">Decline curve analysis, reservoir modeling, and UR estimation.</p>
                  <Badge status="live" />
                </div>
                <div className="text-xs text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN WORKSPACE →
                </div>
              </DataPanel>
            </Link>

            <Link href="/modules/markets" className="group">
              <DataPanel title="Market & Trading" className="h-full group-hover:border-primary/50 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                  <p className="text-muted text-sm leading-relaxed">Real-time pricing, benchmarks, and derivatives analytics.</p>
                  <Badge status="declared" />
                </div>
                <div className="text-xs text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN WORKSPACE →
                </div>
              </DataPanel>
            </Link>

            <Link href="/modules/economics" className="group">
              <DataPanel title="Cost & Economics" className="h-full group-hover:border-primary/50 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                  <p className="text-muted text-sm leading-relaxed">CAPEX/OPEX modeling, cash flow analysis, and project economics.</p>
                  <Badge status="beta" />
                </div>
                <div className="text-xs text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN WORKSPACE →
                </div>
              </DataPanel>
            </Link>

            <Link href="/modules/gis" className="group">
              <DataPanel title="GIS & Asset Intelligence" className="h-full group-hover:border-primary/50 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                  <p className="text-muted text-sm leading-relaxed">Spatial analytics, infrastructure mapping, and geological overlays.</p>
                  <Badge status="declared" />
                </div>
                <div className="text-xs text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN WORKSPACE →
                </div>
              </DataPanel>
            </Link>

            <Link href="/modules/risk" className="group">
              <DataPanel title="Risk & Regulatory" className="h-full group-hover:border-primary/50 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                  <p className="text-muted text-sm leading-relaxed">Geopolitical risk scoring, compliance tracking, and emissions.</p>
                  <Badge status="declared" />
                </div>
                <div className="text-xs text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN WORKSPACE →
                </div>
              </DataPanel>
            </Link>

             <Link href="/modules/intel" className="group">
              <DataPanel title="Intelligence" className="h-full group-hover:border-primary/50 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                  <p className="text-muted text-sm leading-relaxed">News, deals, and global energy intelligence feeds.</p>
                  <Badge status="simulated" />
                </div>
                <div className="text-xs text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN WORKSPACE →
                </div>
              </DataPanel>
            </Link>
          </div>
        </section>

        {/* Architecture & Contracts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <div>
             <SectionHeader title="Platform Architecture" className="mb-4" />
             <DataPanel>
               <p className="mb-4 text-muted text-sm leading-relaxed">
                 Microservices-based architecture ensuring high availability and vendor neutrality.
                 Built on a modular hexagonal architecture pattern.
               </p>
               <Link href="/architecture" className="text-primary hover:text-white text-sm font-mono underline decoration-dotted underline-offset-4">
                 VIEW ARCHITECTURE SPEC →
               </Link>
             </DataPanel>
           </div>
           <div>
             <SectionHeader title="Contract API" className="mb-4" />
             <DataPanel>
               <p className="mb-4 text-muted text-sm leading-relaxed">
                 Live programmatic access to platform metadata and health status.
                 Fully typed definitions available via SDK.
               </p>
               <Link href="/contracts" className="text-primary hover:text-white text-sm font-mono underline decoration-dotted underline-offset-4">
                 BROWSE CONTRACTS →
               </Link>
             </DataPanel>
           </div>
        </section>

        <DetailDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title={`${activeKpi} Details`}
            subtitle="Real-time metric analysis"
            source="PetroSquare Data Fabric"
            timestamp={new Date().toLocaleTimeString()}
            tabs={[
                { id: 'overview', label: 'Overview', content: <div className="text-muted text-sm">Detailed breakdown of {activeKpi} metrics and historical performance.</div> },
                { id: 'trends', label: 'Trends', content: <div className="text-muted text-sm">Trend analysis over the last 30 days.</div> },
                { id: 'drivers', label: 'Drivers', content: <div className="text-muted text-sm">Key factors influencing current performance.</div> },
                { id: 'risks', label: 'Risks', content: <div className="text-muted text-sm">Potential risk factors and mitigation strategies.</div> },
                { id: 'data', label: 'Raw Data', content: <div className="text-muted text-sm font-mono p-2 bg-surface-highlight/10 rounded">JSON data export...</div> },
            ]}
        />
      </PageContainer>
    </AppLayout>
  );
}
