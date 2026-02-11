# PetroSquare Platform

Vendor-neutral digital operating system for oil and gas enterprises.

## Architecture
This project is a **pnpm monorepo** containing:

- **Apps**:
  - `apps/web`: Next.js frontend (App Router).
  - `apps/api`: Express backend API.
- **Packages**:
  - `packages/ui`: Shared React component library.
  - `packages/types`: Shared TypeScript domain definitions.
  - `packages/config`: Shared configuration (ESLint, TSConfig, Tailwind).

## Operational Usage

### Navigation & Routing
The platform uses a shallow, asset-centric navigation structure:
- `/`: Home (Capabilities Dashboard)
- `/modules`: Directory of all functional modules
- `/modules/[module]`: Dynamic workspace for a specific domain (e.g., Production, Markets)
- `/architecture`: System layer documentation
- `/contracts`: Live API contract definitions
- `/capabilities`: Declared system capabilities

### Live Contract API
The platform exposes live metadata and capability definitions via Next.js Route Handlers:
- `GET /api/health`: System status, timestamp, and environment.
- `GET /api/meta`: Build version, commit SHA, and region.
- `GET /api/capabilities`: JSON representation of the declared domain modules.

### System Inspector
A global **System Inspector** is available on all pages (toggle via the top-right "SYSTEM" button). It provides:
- Real-time connectivity status.
- Build metadata (Version, Commit).
- Data governance policy statements.
- Context-aware debugging information.

### Module Workspaces
Each module workspace (`/modules/[module]`) is an operational shell designed for decision support, featuring:
- **Definition Rail**: Purpose, inputs, outputs, and assumptions.
- **Functional Scope**: API endpoint and service context.
- **Decision Support**: Visual analytics placeholders.
- **Auditability**: Event logs and transaction history.

## Development

### Adding a New Module
1. Add the module definition to `apps/web/lib/data.ts` in the `CAPABILITIES` constant.
2. The system will automatically generate the route at `/modules/[id]` and add it to the Home and Modules pages.
3. If specific custom logic is needed, extend `apps/web/app/modules/[module]/page.tsx` or create a specific route.

### UI Interaction
- **Density Toggle**: Switch between 'Comfortable' and 'Condensed' views via the top header.
- **Inspect Mode**: Toggle 'Inspect' to reveal data provenance, units, and latency metrics on all DataPanels.

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 9
- Docker (optional, for containerized run)

### Installation
```bash
pnpm install
```

### Development
Start all apps in development mode:
```bash
pnpm dev
```

### Build
Build all apps and packages:
```bash
pnpm build
```

## Documentation
- [Architecture](./docs/ARCHITECTURE.md)
- [UX Guidelines](./docs/UX.md)
