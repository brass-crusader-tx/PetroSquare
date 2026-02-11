# PetroSquare Platform

Vendor-neutral digital operating system for oil and gas enterprises.

## Architecture
This project is a **pnpm monorepo** containing:

- **Apps**:
  - `apps/web`: Next.js frontend.
  - `apps/api`: Express backend API.
- **Packages**:
  - `packages/ui`: Shared React component library.
  - `packages/types`: Shared TypeScript domain definitions.
  - `packages/config`: Shared configuration (ESLint, TSConfig, Tailwind).

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
