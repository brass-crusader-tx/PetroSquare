import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { SmartDataPanel } from '../../components/SmartDataPanel';
import { CAPABILITIES } from '../../lib/data';

export default function CapabilitiesPage() {
  return (
    <PageContainer>
      <div className="mb-10 pt-10">
         <h1 className="text-4xl font-bold text-white mb-4">System Capabilities</h1>
         <p className="text-muted text-lg max-w-3xl">
           Declared functional domains and service layers currently active in the platform.
         </p>
      </div>

      <div className="space-y-12">
        {CAPABILITIES.map((cap) => (
          <section key={cap.domain}>
            <SectionHeader title={cap.domain} />
            <div className="grid grid-cols-1 gap-6">
              {cap.layers.map((layer) => (
                <SmartDataPanel key={layer.name} title={layer.name}>
                  <p className="mb-4 text-muted">{layer.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {layer.modules.map((mod) => (
                      <div key={mod.id} className="p-3 border border-border bg-background rounded-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white font-semibold">{mod.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                            mod.status === 'active' ? 'bg-data-positive/20 text-data-positive' : 'bg-data-warning/20 text-data-warning'
                          }`}>
                            {mod.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted mb-2">{mod.description}</p>
                        <div className="text-[10px] text-muted font-mono bg-surface-highlight/20 px-2 py-1 rounded inline-block">
                          {mod.path}
                        </div>
                      </div>
                    ))}
                  </div>
                </SmartDataPanel>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
