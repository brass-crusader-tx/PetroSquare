"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageContainer, SectionHeader, DataPanel, Badge, IconButton } from '@petrosquare/ui';
import { useDensity } from '../../../context/DensityContext';
import { DensityToggle } from '../../../components/DensityToggle';

interface ModuleData {
  id: string;
  title: string;
  status: 'live' | 'declared' | 'beta';
  purpose: string;
  inputs: string[];
  outputs: string[];
  assumptions: string[];
  scope: string;
  decisionSupport: string;
  interfaces: string[];
  auditability: string;
}

const modules: Record<string, ModuleData> = {
  production: {
    id: 'production',
    title: 'Production & Reserves',
    status: 'live',
    purpose: 'Fit decline curves and estimate Ultimate Recovery (UR) from well data.',
    inputs: ['Wellhead Pressure (psi)', 'Daily Flow Rates (bbl/d)', 'Injectivity Index'],
    outputs: ['Forecasted EUR', 'Decline Rate (b)', 'Remaining Reserves'],
    assumptions: ['Standard Conditions (STP)', 'Constant Choke Size', 'Homogeneous Reservoir'],
    scope: 'Single well to field-level aggregation.',
    decisionSupport: 'Optimizes workover schedules and intervention timing.',
    interfaces: ['WITSML Ingestion', 'Reservoir Sim Export', 'Corporate Reserves DB'],
    auditability: 'All curve parameters versioned with user ID and timestamp.',
  },
  markets: {
    id: 'markets',
    title: 'Market & Trading',
    status: 'declared',
    purpose: 'Monitor commodity prices and analyze arbitrage opportunities.',
    inputs: ['WTI/Brent Futures', 'Crack Spreads', 'Tanker Rates'],
    outputs: ['Realized Price Netback', 'VaR (Value at Risk)', 'Hedging Recommendations'],
    assumptions: ['Market Liquidity', 'FX Rates Stability'],
    scope: 'Global crude and product markets.',
    decisionSupport: 'Supports hedging decisions and cargo routing.',
    interfaces: ['Bloomberg Feed', 'Platts API', 'Internal Trading System'],
    auditability: 'Trade execution logs and price fixings recorded.',
  },
  economics: {
    id: 'economics',
    title: 'Cost & Economics',
    status: 'beta',
    purpose: 'Evaluate project profitability and cash flow scenarios.',
    inputs: ['CAPEX Schedule', 'OPEX Drivers', 'Tax Regimes'],
    outputs: ['NPV @ 10%', 'IRR', 'Breakeven Oil Price'],
    assumptions: ['Inflation Rate 2%', 'Oil Price Scenario Base'],
    scope: 'Asset lifecycle economics.',
    decisionSupport: 'FID (Final Investment Decision) analysis.',
    interfaces: ['ERP (SAP)', 'Production Forecasts'],
    auditability: 'Scenario assumptions locked upon approval.',
  },
  gis: {
    id: 'gis',
    title: 'GIS & Asset Intelligence',
    status: 'declared',
    purpose: 'Visualizing asset locations and spatial relationships.',
    inputs: ['Shapefiles', 'Satellite Imagery', 'Lease Boundaries'],
    outputs: ['Asset Maps', 'Proximity Alerts', 'Surface Logistics Plans'],
    assumptions: ['Coordinate Reference System WGS84'],
    scope: 'Geospatial visualization layer.',
    decisionSupport: 'Site selection and pipeline routing.',
    interfaces: ['ArcGIS Server', 'Google Maps API'],
    auditability: 'Layer modifications tracked.',
  },
  risk: {
    id: 'risk',
    title: 'Risk & Regulatory',
    status: 'declared',
    purpose: 'Managing compliance and geopolitical exposure.',
    inputs: ['Sanction Lists', 'Emissions Data', 'Regulatory Texts'],
    outputs: ['Risk Heatmap', 'Compliance Scorecard', 'Incident Reports'],
    assumptions: ['Regulatory Framework Stability'],
    scope: 'Enterprise risk management.',
    decisionSupport: 'Mitigation planning and audit readiness.',
    interfaces: ['External Regulatory Feeds', 'EHS Systems'],
    auditability: 'Audit trail of compliance checks.',
  },
};

export default function ModulePage() {
  const params = useParams();
  const slug = params.module as string;
  const module = modules[slug];
  const { density, inspectMode } = useDensity();
  const [commit, setCommit] = useState<string>('Loading...');

  useEffect(() => {
    fetch('/api/meta').then(r => r.json()).then(data => setCommit(data.commit)).catch(() => setCommit('Unknown'));
  }, []);

  if (!module) {
    return (
      <main className="min-h-screen bg-background text-text p-10">
        <PageContainer>
           <h1 className="text-2xl text-white">Module Not Found: {slug}</h1>
           <Link href="/capabilities" className="text-primary underline">Back to Capabilities</Link>
        </PageContainer>
      </main>
    );
  }

  const densityClass = density === 'compact' ? 'space-y-2' : 'space-y-6';
  const panelPadding = density === 'compact' ? 'p-4' : 'p-6';
  const fontSize = density === 'compact' ? 'text-xs' : 'text-sm';

  return (
    <main className="min-h-screen bg-background text-text">
       <header className="border-b border-border bg-surface sticky top-0 z-20">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <Link href="/" className="text-muted hover:text-white font-mono">←</Link>
             <h1 className="text-lg font-bold text-white font-sans">{module.title}</h1>
             <Badge status={module.status as any}>{module.status}</Badge>
           </div>
           <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end text-xs text-muted font-mono">
                <span>COMMIT</span>
                <span className="text-white">{commit.substring(0, 7)}</span>
              </div>
              <DensityToggle />
           </div>
         </div>
       </header>

       <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Rail - Definition */}
          <aside className="lg:col-span-1 space-y-6">
             <div className="bg-surface/50 p-4 rounded border border-border">
               <h3 className="text-xs font-bold uppercase text-muted mb-4 tracking-wider">Definition</h3>

               <div className="space-y-4">
                 <div>
                   <h4 className="text-[10px] uppercase text-muted mb-1">Purpose</h4>
                   <p className="text-sm text-white leading-relaxed">{module.purpose}</p>
                 </div>

                 <div>
                   <h4 className="text-[10px] uppercase text-muted mb-1">Data Inputs</h4>
                   <ul className="text-xs text-blue-200 font-mono space-y-1">
                     {module.inputs.map(i => <li key={i}>• {i}</li>)}
                   </ul>
                 </div>

                 <div>
                   <h4 className="text-[10px] uppercase text-muted mb-1">Outputs</h4>
                   <ul className="text-xs text-green-200 font-mono space-y-1">
                     {module.outputs.map(o => <li key={o}>→ {o}</li>)}
                   </ul>
                 </div>

                 <div>
                   <h4 className="text-[10px] uppercase text-muted mb-1">Assumptions / Units</h4>
                   <ul className="text-xs text-muted font-mono space-y-1">
                     {module.assumptions.map(a => <li key={a}>- {a}</li>)}
                   </ul>
                 </div>
               </div>
             </div>
          </aside>

          {/* Main Canvas */}
          <section className={`lg:col-span-3 ${densityClass}`}>

             <DataPanel title="Scope" className={panelPadding}>
               <p className={`${fontSize} text-muted`}>{module.scope}</p>
               {inspectMode && (
                 <div className="mt-4 pt-2 border-t border-dashed border-border text-xs font-mono text-data-warning">
                   meta: scope_id="{module.id}_scope" | version="1.2" | author="Architect"
                 </div>
               )}
             </DataPanel>

             <DataPanel title="Decision Support" className={panelPadding}>
               <p className={`${fontSize} text-muted`}>{module.decisionSupport}</p>
               {inspectMode && (
                 <div className="mt-4 pt-2 border-t border-dashed border-border text-xs font-mono text-data-warning">
                   meta: dss_engine="v2" | latency="realtime" | confidence="high"
                 </div>
               )}
             </DataPanel>

             <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
               <DataPanel title="Interfaces" className={panelPadding}>
                  <ul className={`list-disc list-inside ${fontSize} text-muted`}>
                    {module.interfaces.map(i => <li key={i}>{i}</li>)}
                  </ul>
                  {inspectMode && (
                   <div className="mt-4 pt-2 border-t border-dashed border-border text-xs font-mono text-data-warning">
                     meta: api_contract="v1" | protocol="REST/gRPC"
                   </div>
                 )}
               </DataPanel>

               <DataPanel title="Auditability" className={panelPadding}>
                 <p className={`${fontSize} text-muted`}>{module.auditability}</p>
                 {inspectMode && (
                   <div className="mt-4 pt-2 border-t border-dashed border-border text-xs font-mono text-data-warning">
                     meta: retention="7yrs" | storage="immutable_ledger"
                   </div>
                 )}
               </DataPanel>
             </div>

          </section>

       </div>
    </main>
  );
}
