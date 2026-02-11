import React from 'react';
import { Drawer } from './Drawer';
import { SystemHealth, SystemMeta } from '@petrosquare/types';

interface InspectorProps {
  isOpen: boolean;
  onClose: () => void;
  pathName: string;
}

export function Inspector({ isOpen, onClose, pathName }: InspectorProps) {
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [meta, setMeta] = React.useState<SystemMeta | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/health').then(res => res.json()).then(setHealth).catch(console.error);
      fetch('/api/meta').then(res => res.json()).then(setMeta).catch(console.error);
    }
  }, [isOpen]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="System Inspector">
      <div className="space-y-6">

        {/* Context */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted mb-2">Current Context</h3>
          <div className="p-3 bg-background rounded border border-border font-mono text-sm text-primary break-all">
            {pathName}
          </div>
        </div>

        {/* System Health */}
        <div>
           <h3 className="text-xs uppercase tracking-wider text-muted mb-2">System Health</h3>
           {health ? (
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-muted">Status</span>
                 <span className={health.status === 'ok' ? 'text-data-positive' : 'text-data-critical'}>
                   {health.status.toUpperCase()}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-muted">Environment</span>
                 <span className="text-text font-mono">{health.env}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-muted">Timestamp</span>
                 <span className="text-text font-mono text-xs">{health.timestamp}</span>
               </div>
             </div>
           ) : (
             <div className="text-sm text-muted animate-pulse">Fetching telemetry...</div>
           )}
        </div>

        {/* Build Metadata */}
        <div>
           <h3 className="text-xs uppercase tracking-wider text-muted mb-2">Build Metadata</h3>
           {meta ? (
             <div className="space-y-2 p-3 bg-background rounded border border-border">
               <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                 <span className="text-muted">Version</span>
                 <span className="text-text text-right">{meta.version}</span>
                 <span className="text-muted">Build</span>
                 <span className="text-text text-right">{meta.build}</span>
                 <span className="text-muted">Region</span>
                 <span className="text-text text-right">{meta.region}</span>
               </div>
               <div className="pt-2 border-t border-border mt-2">
                 <span className="text-muted text-xs block mb-1">Commit</span>
                 <code className="block text-xs text-primary">{meta.commit}</code>
               </div>
             </div>
           ) : (
             <div className="text-sm text-muted animate-pulse">Fetching metadata...</div>
           )}
        </div>

        {/* Policy */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted mb-2">Data Policy</h3>
          <p className="text-xs text-muted leading-relaxed">
            All data displayed is vendor-neutral and adheres to the PetroSquare Data Governance Standard v1.0.
            Units are SI unless otherwise specified.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
