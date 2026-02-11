import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { SmartDataPanel } from '../../components/SmartDataPanel';

export default function ContractsPage() {
  return (
    <PageContainer>
       <div className="mb-10 pt-10">
         <h1 className="text-4xl font-bold text-white mb-4">API Contracts</h1>
         <p className="text-muted text-lg max-w-3xl">
           Live interface definitions and schemas for system interoperability.
         </p>
      </div>

      <div className="space-y-6">
        <SmartDataPanel title="System Health">
          <div className="flex items-center justify-between mb-4">
            <code className="text-primary bg-primary/10 px-2 py-1 rounded">GET /api/health</code>
            <span className="text-xs text-muted">Public</span>
          </div>
          <p className="text-sm text-muted mb-4">Returns the operational status of the platform.</p>
          <div className="bg-background p-4 rounded border border-border overflow-x-auto">
            <pre className="text-xs text-muted font-mono">
{`{
  "status": "ok" | "degraded" | "down",
  "timestamp": "ISO-8601 String",
  "env": "production" | "development"
}`}
            </pre>
          </div>
        </SmartDataPanel>

        <SmartDataPanel title="System Metadata">
           <div className="flex items-center justify-between mb-4">
            <code className="text-primary bg-primary/10 px-2 py-1 rounded">GET /api/meta</code>
            <span className="text-xs text-muted">Public</span>
          </div>
          <p className="text-sm text-muted mb-4">Returns build and deployment information.</p>
           <div className="bg-background p-4 rounded border border-border overflow-x-auto">
            <pre className="text-xs text-muted font-mono">
{`{
  "version": "String",
  "build": "String",
  "commit": "String",
  "region": "String"
}`}
            </pre>
          </div>
        </SmartDataPanel>

         <SmartDataPanel title="Capabilities">
           <div className="flex items-center justify-between mb-4">
            <code className="text-primary bg-primary/10 px-2 py-1 rounded">GET /api/capabilities</code>
            <span className="text-xs text-muted">Public</span>
          </div>
          <p className="text-sm text-muted mb-4">Returns the declared capability hierarchy.</p>
           <div className="bg-background p-4 rounded border border-border overflow-x-auto">
            <pre className="text-xs text-muted font-mono">
{`[
  {
    "domain": "String",
    "layers": [
      {
        "name": "String",
        "description": "String",
        "modules": ModuleDefinition[]
      }
    ]
  }
]`}
            </pre>
          </div>
        </SmartDataPanel>
      </div>
    </PageContainer>
  );
}
