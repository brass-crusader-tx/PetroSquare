"use client";

import { AppLayout, PageContainer, SectionHeader, DataPanel } from "@petrosquare/ui";

export default function ArchitecturePage() {
  return (
    <AppLayout currentPath="/architecture">
      <PageContainer>
        <SectionHeader
          title="Platform Architecture"
          description="High-level overview of PetroSquare's modular design."
        />
        <DataPanel>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted">
              PetroSquare is built on a microservices-based architecture ensuring high availability and vendor neutrality.
              The system leverages a hexagonal architecture pattern to isolate domain logic from external interfaces.
            </p>
            <h3 className="text-lg font-bold text-white mt-6 mb-2">Key Components</h3>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li><strong>Frontend:</strong> Next.js 14 (App Router) with React Server Components.</li>
              <li><strong>API Gateway:</strong> Express.js based edge API.</li>
              <li><strong>Data Fabric:</strong> PostgreSQL + PostGIS for spatial data, TimescaleDB for time-series.</li>
              <li><strong>AI Engine:</strong> Integrated LLM support for insight generation.</li>
            </ul>
          </div>
        </DataPanel>
      </PageContainer>
    </AppLayout>
  );
}
