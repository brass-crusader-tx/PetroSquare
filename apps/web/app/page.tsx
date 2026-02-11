import {
  PageContainer,
  SectionHeader,
  DataPanel,
  InlineMetricBlock,
} from "@petrosquare/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        {/* Hero Section */}
        <div className="mb-20 pt-10">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl font-sans mb-6">
            PetroSquare
          </h1>
          <p className="text-xl text-muted font-mono max-w-2xl">
            Vendor-neutral petroleum intelligence platform.
          </p>
        </div>

        {/* System Intent Section */}
        <section className="mb-20">
          <SectionHeader
            title="System Intent"
            description="Enterprise-grade digital operating system."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DataPanel title="Data Fabric">
              Unified ingestion pipelines for real-time streams (SCADA, IoT) and batch sources, normalized into a canonical model.
            </DataPanel>
            <DataPanel title="Analytics Engine">
              Distributed compute layers supporting physics-based simulations, decline curve analysis, and financial modeling.
            </DataPanel>
            <DataPanel title="Modular Architecture">
              Service-oriented design ensuring independent scalability of domain modules and rapid integration of new capabilities.
            </DataPanel>
          </div>
        </section>

        {/* Platform Modules Overview */}
        <section className="mb-20">
          <SectionHeader
            title="Platform Modules"
            description="Functional domains for upstream operations."
          />
          <div className="space-y-4">
            <DataPanel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                 <InlineMetricBlock label="01" value="Production" trend="neutral" />
                 <InlineMetricBlock label="02" value="Markets" trend="neutral" />
                 <InlineMetricBlock label="03" value="Economics" trend="neutral" />
                 <InlineMetricBlock label="04" value="GIS/Asset" trend="neutral" />
                 <InlineMetricBlock label="05" value="Risk/Reg" trend="neutral" />
              </div>
            </DataPanel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
               <DataPanel title="Production & Reserves">
                 Decline curve analysis, reservoir modeling, and ultimate recovery estimation.
               </DataPanel>
               <DataPanel title="Market & Trading">
                 Real-time pricing, benchmarks, derivatives analytics, and arbitrage opportunities.
               </DataPanel>
               <DataPanel title="Cost & Economics">
                 CAPEX/OPEX modeling, cash flow analysis, and project economics (NPV, IRR).
               </DataPanel>
               <DataPanel title="GIS & Asset Intelligence">
                 Spatial analytics, infrastructure mapping, and geological overlays.
               </DataPanel>
               <DataPanel title="Risk & Regulatory">
                 Geopolitical risk scoring, compliance tracking, and environmental monitoring.
               </DataPanel>
            </div>
          </div>
        </section>

        {/* Architecture Statement */}
        <section>
           <SectionHeader title="Architecture" />
           <DataPanel>
             <p className="leading-relaxed text-muted">
               PetroSquare adopts a layered, microservices-based architecture to deliver high availability and vendor neutrality.
               By decoupling data ingestion, storage, processing, and presentation, the platform ensures that critical
               engineering workflows remain uninterrupted by backend updates. Security is enforced at every layer through
               Role-Based Access Control (RBAC) and encryption, complying with strict industry standards for data sovereignty and integrity.
             </p>
           </DataPanel>
        </section>
      </PageContainer>
    </main>
  );
}
