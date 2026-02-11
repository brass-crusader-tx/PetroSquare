import { notFound } from 'next/navigation';
import { PageContainer, SectionHeader, Badge } from '@petrosquare/ui';
import { SmartDataPanel } from '../../../components/SmartDataPanel';
import { CAPABILITIES } from '../../../lib/data';

export function generateStaticParams() {
  const allModules = CAPABILITIES.flatMap(c => c.layers.flatMap(l => l.modules));
  return allModules.map((mod) => ({
    module: mod.id,
  }));
}

export default function ModuleWorkspacePage({ params }: { params: { module: string } }) {
  const allModules = CAPABILITIES.flatMap(c => c.layers.flatMap(l => l.modules));
  const moduleDef = allModules.find(m => m.id === params.module);

  if (!moduleDef) {
    notFound();
  }

  return (
    <PageContainer>
      {/* Workspace Header */}
      <div className="mb-8 pt-6 border-b border-border pb-6 flex items-center justify-between">
        <div>
           <div className="flex items-center gap-4 mb-2">
             <h1 className="text-3xl font-bold text-white tracking-tight">{moduleDef.name}</h1>
             <Badge variant={moduleDef.status === 'active' ? 'success' : 'warning'}>
               {moduleDef.status === 'active' ? 'Connected' : 'Declared'}
             </Badge>
           </div>
           <p className="text-muted text-sm max-w-2xl">
             {moduleDef.description}
           </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-[10px] uppercase text-muted tracking-widest mb-1">Build Commit</div>
          <code className="text-xs text-primary">{process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) || 'DEV-HEAD'}</code>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Rail: Definition */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
             <div>
               <h3 className="text-xs uppercase tracking-wider text-muted mb-3 border-b border-border pb-1">Purpose</h3>
               <p className="text-sm text-muted leading-relaxed">
                 Provides analytical capabilities for {moduleDef.name.toLowerCase()} workflows, integrating domain-specific data models with the central platform fabric.
               </p>
             </div>

             <div>
               <h3 className="text-xs uppercase tracking-wider text-muted mb-3 border-b border-border pb-1">Data Inputs</h3>
               <ul className="text-sm text-muted space-y-1 list-disc pl-4">
                 <li>Time-series telemetry</li>
                 <li>Static asset metadata</li>
                 <li>Reference market data</li>
               </ul>
             </div>

             <div>
               <h3 className="text-xs uppercase tracking-wider text-muted mb-3 border-b border-border pb-1">Outputs</h3>
               <ul className="text-sm text-muted space-y-1 list-disc pl-4">
                 <li>Normalized datasets</li>
                 <li>Analytical forecasts</li>
                 <li>Audit logs</li>
               </ul>
             </div>

              <div>
               <h3 className="text-xs uppercase tracking-wider text-muted mb-3 border-b border-border pb-1">Assumptions</h3>
               <p className="text-xs text-muted">
                 Standard temperature/pressure (STP) applies. Currency in USD unless noted.
               </p>
             </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <div className="lg:col-span-3 space-y-6">
          <SmartDataPanel title="Functional Scope">
            <p className="mb-4 text-sm text-muted">
              This workspace encapsulates the operational logic for {moduleDef.name}. It is designed to facilitate high-fidelity decision making through transparent data processing.
            </p>
            <div className="p-4 bg-background border border-border rounded-sm text-xs font-mono text-muted">
              Service Endpoint: /api/v1/{moduleDef.id}
            </div>
          </SmartDataPanel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SmartDataPanel title="Decision Support">
               <p className="text-sm text-muted mb-4">
                 Key indicators and model outputs are synthesized here.
               </p>
               <div className="h-24 bg-surface-highlight/10 border border-border border-dashed rounded flex items-center justify-center text-xs text-muted">
                 [Visual Analytics Container]
               </div>
            </SmartDataPanel>

            <SmartDataPanel title="Interfaces">
               <p className="text-sm text-muted mb-4">
                 Connected upstream and downstream systems.
               </p>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs text-muted">
                   <span>Ingestion Pipeline</span>
                   <span className="text-data-positive">Active</span>
                 </div>
                  <div className="flex justify-between text-xs text-muted">
                   <span>Export Bus</span>
                   <span className="text-data-positive">Active</span>
                 </div>
               </div>
            </SmartDataPanel>
          </div>

          <SmartDataPanel title="Auditability">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-muted">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 font-mono uppercase tracking-wider">Event ID</th>
                    <th className="pb-2 font-mono uppercase tracking-wider">Timestamp</th>
                    <th className="pb-2 font-mono uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2 font-mono">EVT-{Math.floor(Math.random() * 1000)}</td>
                    <td className="py-2 font-mono">{new Date().toISOString().split('T')[0]}</td>
                    <td className="py-2">Module Initialized</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">EVT-{Math.floor(Math.random() * 1000)}</td>
                    <td className="py-2 font-mono">{new Date(Date.now() - 3600000).toISOString().split('T')[0]}</td>
                    <td className="py-2">Data Synced</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SmartDataPanel>

           <SmartDataPanel title="Next Steps">
             <div className="flex gap-4">
               <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors">
                 Run Diagnostics
               </button>
               <button className="px-4 py-2 bg-surface-highlight text-text text-sm font-medium rounded-sm hover:bg-surface-highlight/80 transition-colors border border-border">
                 View Documentation
               </button>
             </div>
           </SmartDataPanel>
        </div>
      </div>
    </PageContainer>
  );
}
