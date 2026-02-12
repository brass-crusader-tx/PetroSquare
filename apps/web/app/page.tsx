import Link from "next/link";
import {
  PageContainer,
  SectionHeader,
  DataPanel,
  Badge,
} from "@petrosquare/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text">
      <nav className="border-b border-border bg-surface/50 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-white font-sans">
            PetroSquare
          </Link>
          <div className="flex space-x-6">
            <Link href="/capabilities" className="text-sm font-medium text-muted hover:text-white transition-colors">
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
        {/* Hero Section */}
        <div className="mb-20 pt-10">
          <div className="flex items-center space-x-4 mb-4">
             <Badge status="live">System Active</Badge>
             <span className="text-muted text-sm font-mono">v1.0.0</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl font-sans mb-6">
            PetroSquare
          </h1>
          <p className="text-xl text-muted font-mono max-w-2xl">
            Vendor-neutral digital operating system for oil & gas.
          </p>
        </div>

        {/* Capabilities Grid */}
        <section className="mb-20">
          <SectionHeader
            title="Operational Modules"
            description="Select a domain module to access its workspace."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/modules/production" className="group">
              <DataPanel title="Production & Reserves" className="h-full group-hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-muted text-sm">Decline curve analysis, reservoir modeling, and UR estimation.</p>
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
                  <p className="text-muted text-sm">Real-time pricing, benchmarks, and derivatives analytics.</p>
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
                  <p className="text-muted text-sm">CAPEX/OPEX modeling, cash flow analysis, and project economics.</p>
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
                  <p className="text-muted text-sm">Spatial analytics, infrastructure mapping, and geological overlays.</p>
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
                  <p className="text-muted text-sm">Geopolitical risk scoring, compliance tracking, and emissions.</p>
                  <Badge status="declared" />
                </div>
                <div className="text-xs text-primary font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN WORKSPACE →
                </div>
              </DataPanel>
            </Link>
          </div>
        </section>

        {/* Architecture & Contracts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
             <SectionHeader title="Platform Architecture" className="mb-4" />
             <DataPanel>
               <p className="mb-4 text-muted">
                 Microservices-based architecture ensuring high availability and vendor neutrality.
               </p>
               <Link href="/architecture" className="text-primary hover:text-white text-sm font-mono underline decoration-dotted underline-offset-4">
                 VIEW ARCHITECTURE SPEC →
               </Link>
             </DataPanel>
           </div>
           <div>
             <SectionHeader title="Contract API" className="mb-4" />
             <DataPanel>
               <p className="mb-4 text-muted">
                 Live programmatic access to platform metadata and health status.
               </p>
               <Link href="/contracts" className="text-primary hover:text-white text-sm font-mono underline decoration-dotted underline-offset-4">
                 BROWSE CONTRACTS →
               </Link>
             </DataPanel>
           </div>
        </section>
      </PageContainer>
    </main>
  );
}
