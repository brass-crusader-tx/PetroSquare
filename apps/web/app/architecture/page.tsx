import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { SmartDataPanel } from '../../components/SmartDataPanel';

export default function ArchitecturePage() {
  return (
    <PageContainer>
       <div className="mb-10 pt-10">
         <h1 className="text-4xl font-bold text-white mb-4">Platform Architecture</h1>
         <p className="text-muted text-lg max-w-3xl">
           Layered microservices architecture adhering to TOGAF and OSDU standards.
         </p>
      </div>

      <div className="space-y-8">
        <SmartDataPanel title="Layer 1: User Interface">
          <p className="mb-4">
            Next.js 14 frontend utilizing React Server Components and Tailwind CSS.
            Delivers role-based experiences for engineers, analysts, and executives.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
             <li>Component Library (@petrosquare/ui)</li>
             <li>Client-side State Management (Context)</li>
             <li>Live Telemetry Inspector</li>
          </ul>
        </SmartDataPanel>

        <SmartDataPanel title="Layer 2: API Gateway & Orchestration">
          <p className="mb-4">
            Unified API surface providing contract-driven access to backend services.
            Handles authentication, rate limiting, and request routing.
          </p>
           <ul className="list-disc pl-5 space-y-1 text-xs">
             <li>Next.js Route Handlers</li>
             <li>Contract Validation (Zod/Types)</li>
             <li>Health & Meta Endpoints</li>
          </ul>
        </SmartDataPanel>

        <SmartDataPanel title="Layer 3: Domain Services">
          <p className="mb-4">
            Independent microservices encapsulating business logic for specific domains.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
             <div className="p-2 bg-background border border-border text-center text-xs">Production Svc</div>
             <div className="p-2 bg-background border border-border text-center text-xs">Market Svc</div>
             <div className="p-2 bg-background border border-border text-center text-xs">Economics Svc</div>
             <div className="p-2 bg-background border border-border text-center text-xs">GIS Svc</div>
          </div>
        </SmartDataPanel>
      </div>
    </PageContainer>
  );
}
