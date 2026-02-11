import Link from 'next/link';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { SmartDataPanel } from '../components/SmartDataPanel';
import { CAPABILITIES } from '../lib/data';

export default function Home() {
  return (
    <div className="min-h-screen">
      <PageContainer>
        {/* Hero Section */}
        <div className="mb-20 pt-10">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl font-sans mb-6">
            PetroSquare
          </h1>
          <p className="text-xl text-muted font-mono max-w-2xl leading-relaxed">
            Vendor-neutral digital operating system for oil & gas enterprises.
            Unified data fabric, distributed analytics, and secure domain services.
          </p>
          <div className="mt-8 flex gap-4">
             <Link href="/modules" className="px-6 py-3 bg-primary text-white font-medium rounded-sm hover:bg-primary/90 transition-colors">
               Launch Modules
             </Link>
             <Link href="/architecture" className="px-6 py-3 bg-surface-highlight text-text font-medium rounded-sm hover:bg-surface-highlight/80 transition-colors border border-border">
               View Architecture
             </Link>
          </div>
        </div>

        {/* System Capabilities / Tiles */}
        <div className="space-y-16">
          {CAPABILITIES.map((cap) => (
            <section key={cap.domain}>
              <SectionHeader
                title={cap.domain}
                description={`${cap.layers.reduce((acc, l) => acc + l.modules.length, 0)} Active Services`}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cap.layers.map((layer) => (
                  <SmartDataPanel key={layer.name} title={layer.name} className="h-full">
                    <p className="mb-6 text-sm text-muted h-10 line-clamp-2">{layer.description}</p>
                    <div className="space-y-2">
                       {layer.modules.map((mod) => (
                         <Link key={mod.id} href={mod.path} className="block group">
                           <div className="p-3 bg-background border border-border rounded-sm hover:border-primary/50 transition-colors flex items-center justify-between">
                             <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                               {mod.name}
                             </span>
                             <span className={`w-2 h-2 rounded-full ${mod.status === 'active' ? 'bg-data-positive' : 'bg-data-warning'}`} />
                           </div>
                         </Link>
                       ))}
                    </div>
                  </SmartDataPanel>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
