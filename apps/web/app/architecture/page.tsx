import Link from "next/link";
import { PageContainer, SectionHeader, DataPanel, Badge } from "@petrosquare/ui";

export default function ArchitecturePage() {
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
            <Link href="/architecture" className="text-sm font-medium text-white transition-colors">
              Architecture
            </Link>
            <Link href="/contracts" className="text-sm font-medium text-muted hover:text-white transition-colors">
              Contracts
            </Link>
          </div>
        </div>
      </nav>

      <PageContainer>
        <SectionHeader title="Platform Architecture" description="Technical constitution and design principles." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <DataPanel title="Core Principles">
             <ul className="list-disc list-inside space-y-2 text-muted text-sm">
               <li><strong className="text-white">Vendor Neutrality:</strong> Avoid lock-in by using open standards (OSDU, PPDM).</li>
               <li><strong className="text-white">Modularity:</strong> Microservices architecture for independent scaling.</li>
               <li><strong className="text-white">Inspectability:</strong> Transparent data lineage and confidence bounds.</li>
               <li><strong className="text-white">Security:</strong> RBAC and encryption at every layer.</li>
             </ul>
           </DataPanel>

           <DataPanel title="Technology Stack">
             <div className="space-y-4">
               <div className="flex justify-between border-b border-border pb-2">
                 <span className="text-muted text-sm">Frontend</span>
                 <span className="text-white text-sm font-mono">Next.js 14, React 18, Tailwind</span>
               </div>
               <div className="flex justify-between border-b border-border pb-2">
                 <span className="text-muted text-sm">Backend</span>
                 <span className="text-white text-sm font-mono">Node.js, Express, TypeScript</span>
               </div>
               <div className="flex justify-between border-b border-border pb-2">
                 <span className="text-muted text-sm">Infrastructure</span>
                 <span className="text-white text-sm font-mono">Docker, Kubernetes (Target)</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted text-sm">Deployment</span>
                 <span className="text-white text-sm font-mono">Vercel (Hybrid)</span>
               </div>
             </div>
           </DataPanel>
        </div>

        <SectionHeader title="System Components" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <DataPanel title="Data Ingestion">
             Connectors for SCADA/IoT, ERP/CRM, and market feeds using MQTT, OPC UA, and REST.
           </DataPanel>
           <DataPanel title="Storage & Management">
             Multi-tier data lake (S3/HDFS) for raw data + Time-series DB (Historian) + GIS Database.
           </DataPanel>
           <DataPanel title="Processing & AI">
             Distributed compute engines (Spark) and AI model serving for decline curves and anomaly detection.
           </DataPanel>
        </div>

      </PageContainer>
    </main>
  );
}
