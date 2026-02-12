import Link from "next/link";
import { PageContainer, SectionHeader, DataPanel, Badge } from "@petrosquare/ui";

export default function ContractsPage() {
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
            <Link href="/contracts" className="text-sm font-medium text-white transition-colors">
              Contracts
            </Link>
          </div>
        </div>
      </nav>

      <PageContainer>
        <SectionHeader title="Platform Contracts" description="Public API contracts and data models." />

        <div className="space-y-6">
           <DataPanel title="Live Endpoints">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <a href="/api/health" target="_blank" className="bg-surface-highlight/10 p-4 rounded border border-border hover:border-primary transition-colors group">
                 <div className="flex justify-between items-center mb-2">
                   <span className="font-mono text-sm text-primary group-hover:underline">GET /api/health</span>
                   <Badge status="live">200 OK</Badge>
                 </div>
                 <p className="text-xs text-muted">Returns system health status, version, and timestamp.</p>
               </a>

               <a href="/api/meta" target="_blank" className="bg-surface-highlight/10 p-4 rounded border border-border hover:border-primary transition-colors group">
                 <div className="flex justify-between items-center mb-2">
                   <span className="font-mono text-sm text-primary group-hover:underline">GET /api/meta</span>
                   <Badge status="live">200 OK</Badge>
                 </div>
                 <p className="text-xs text-muted">Returns build metadata, commit hash, and environment info.</p>
               </a>

               <a href="/api/capabilities" target="_blank" className="bg-surface-highlight/10 p-4 rounded border border-border hover:border-primary transition-colors group">
                 <div className="flex justify-between items-center mb-2">
                   <span className="font-mono text-sm text-primary group-hover:underline">GET /api/capabilities</span>
                   <Badge status="live">200 OK</Badge>
                 </div>
                 <p className="text-xs text-muted">Returns list of available modules and their status.</p>
               </a>
             </div>
           </DataPanel>

           <DataPanel title="Data Models">
              <p className="text-muted text-sm mb-4">
                Canonical types exported via <code>@petrosquare/types</code>.
              </p>
              <div className="bg-black/30 p-4 rounded border border-border font-mono text-xs text-muted overflow-x-auto">
                <pre>{`interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
}

interface Capability {
  id: string;
  title: string;
  description: string;
  status: 'live' | 'declared' | 'beta';
  href: string;
}`}</pre>
              </div>
           </DataPanel>
        </div>
      </PageContainer>
    </main>
  );
}
