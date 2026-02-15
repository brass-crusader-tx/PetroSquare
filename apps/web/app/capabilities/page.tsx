import Link from "next/link";
import { PageContainer, SectionHeader, DataPanel, Badge } from "@petrosquare/ui";

const capabilities = [
  { id: 'production', title: 'Production & Reserves', status: 'live', description: 'Decline curve analysis, reservoir modeling, and ultimate recovery estimation.' },
  { id: 'markets', title: 'Market & Trading', status: 'declared', description: 'Real-time pricing, benchmarks, derivatives analytics, and arbitrage opportunities.' },
  { id: 'economics', title: 'Cost & Economics', status: 'beta', description: 'CAPEX/OPEX modeling, cash flow analysis, and project economics (NPV, IRR).' },
  { id: 'gis', title: 'GIS & Asset Intelligence', status: 'declared', description: 'Spatial analytics, infrastructure mapping, and geological overlays.' },
  { id: 'risk', title: 'Risk & Regulatory', status: 'declared', description: 'Geopolitical risk scoring, compliance tracking, and environmental monitoring.' },
];

export default function CapabilitiesPage() {
  return (
    <main className="h-screen overflow-y-auto bg-background text-text scroll-smooth">
       <nav className="border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <img src="/logo/petrosquare-mark.svg" alt="PetroSquare" className="w-14 h-14 invert brightness-0 grayscale opacity-90 group-hover:opacity-100 transition-opacity" />
             <span className="text-xl font-bold tracking-tight text-white font-sans">PetroSquare</span>
          </Link>
          <div className="flex space-x-6">
            <Link href="/capabilities" className="text-sm font-medium text-white transition-colors">
              Capabilities
            </Link>
            <Link href="/architecture" className="text-sm font-medium text-muted hover:text-white transition-colors">
              Architecture
            </Link>
            <Link href="/contracts" className="text-sm font-medium text-muted hover:text-white transition-colors">
              Contracts
            </Link>
          </div>
        </div>
      </nav>

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
    </main>
  );
}
