import Link from "next/link";
import { PageContainer, SectionHeader, DataPanel, Badge, AppLayout } from "@petrosquare/ui";

const capabilities = [
  { id: 'production', title: 'Production & Reserves', status: 'live', description: 'Decline curve analysis, reservoir modeling, and ultimate recovery estimation.' },
  { id: 'markets', title: 'Market & Trading', status: 'declared', description: 'Real-time pricing, benchmarks, derivatives analytics, and arbitrage opportunities.' },
  { id: 'economics', title: 'Cost & Economics', status: 'beta', description: 'CAPEX/OPEX modeling, cash flow analysis, and project economics (NPV, IRR).' },
  { id: 'gis', title: 'GIS & Asset Intelligence', status: 'declared', description: 'Spatial analytics, infrastructure mapping, and geological overlays.' },
  { id: 'risk', title: 'Risk & Regulatory', status: 'declared', description: 'Geopolitical risk scoring, compliance tracking, and environmental monitoring.' },
];

export default function CapabilitiesPage() {
  return (
    <AppLayout currentPath="/capabilities">
      <PageContainer>
        <SectionHeader title="Platform Capabilities" description="Functional modules declared in the platform registry." />

        <div className="grid grid-cols-1 gap-4">
          {capabilities.map(cap => (
            <DataPanel key={cap.id} className="relative overflow-hidden group hover:border-surface-highlight transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{cap.title}</h3>
                    <Badge status={cap.status as any}>{cap.status}</Badge>
                  </div>
                  <p className="text-muted text-sm max-w-2xl">{cap.description}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href={`/modules/${cap.id}`} className="text-sm font-mono text-primary hover:text-white underline decoration-dotted underline-offset-4">
                    ACCESS MODULE →
                  </Link>
                </div>
              </div>
            </DataPanel>
          ))}
        </div>
      </PageContainer>
    </AppLayout>
  );
}
