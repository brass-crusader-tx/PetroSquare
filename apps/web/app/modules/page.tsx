import Link from 'next/link';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { SmartDataPanel } from '../../components/SmartDataPanel';
import { CAPABILITIES } from '../../lib/data';

export default function ModulesPage() {
  const allModules = CAPABILITIES.flatMap(c => c.layers.flatMap(l => l.modules));

  return (
    <PageContainer>
       <div className="mb-10 pt-10">
         <h1 className="text-4xl font-bold text-white mb-4">Modules Directory</h1>
         <p className="text-muted text-lg max-w-3xl">
           Access functional workspaces.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allModules.map((mod) => (
          <Link key={mod.id} href={mod.path} className="group block">
            <SmartDataPanel className="h-full transition-colors group-hover:border-primary/50">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{mod.name}</h3>
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wide border ${
                     mod.status === 'active'
                       ? 'bg-data-positive/10 text-data-positive border-data-positive/20'
                       : 'bg-data-warning/10 text-data-warning border-data-warning/20'
                   }`}>
                     {mod.status}
                   </span>
               </div>
               <p className="text-sm text-muted mb-6">{mod.description}</p>
               <div className="flex items-center text-primary text-xs font-mono uppercase tracking-wider">
                 Open Workspace &rarr;
               </div>
            </SmartDataPanel>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
