"use client";

import { AppLayout, PageContainer, SectionHeader, DataPanel } from "@petrosquare/ui";

export default function ContractsPage() {
  return (
    <AppLayout currentPath="/contracts">
      <PageContainer>
        <SectionHeader
          title="Contract API"
          description="Live programmatic access to platform metadata and health status."
        />
        <DataPanel>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted">
              PetroSquare exposes a fully typed contract API for external integrations.
            </p>
            <h3 className="text-lg font-bold text-white mt-6 mb-2">Available Endpoints</h3>
            <ul className="text-muted space-y-4 font-mono text-sm">
              <li className="p-3 bg-surface-highlight/10 rounded border border-border">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-primary font-bold">GET</span>
                  <span className="text-white">/api/health</span>
                </div>
                <div className="text-xs">System health and uptime metrics.</div>
              </li>
              <li className="p-3 bg-surface-highlight/10 rounded border border-border">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-primary font-bold">GET</span>
                  <span className="text-white">/api/meta</span>
                </div>
                <div className="text-xs">Platform metadata and version info.</div>
              </li>
              <li className="p-3 bg-surface-highlight/10 rounded border border-border">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-primary font-bold">GET</span>
                  <span className="text-white">/api/capabilities</span>
                </div>
                <div className="text-xs">List of enabled modules and features.</div>
              </li>
            </ul>
          </div>
        </DataPanel>
      </PageContainer>
    </AppLayout>
  );
}
