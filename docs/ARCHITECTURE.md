# PetroSquare Platform Architecture

## Overview
PetroSquare is a vendor-neutral digital operating system for oil and gas enterprises. The architecture is layered, modular, and service-oriented.

## Layers

### 1. Presentation / UI Layer (`apps/web`, `packages/ui`)
- **Technology**: Next.js, React, Tailwind CSS.
- **Responsibility**: Provides role-based portals for engineers, analysts, and executives.
- **Design System**: "Industrial" dark mode aesthetic, centralized in `packages/ui`.

### 2. API & Integration Layer (`apps/api`, `packages/types`)
- **Technology**: Node.js, Express, TypeScript.
- **Responsibility**: Exposes RESTful APIs, handles authentication, and orchestrates data flow.
- **Contracts**: Defined in `packages/types` to ensure type safety across frontend and backend.

### 3. Processing & Analytics Layer (Future)
- **Responsibility**: Distributed compute engines (Spark, K8s) for physics-based models and ML.

### 4. Data Storage & Management Layer (Future)
- **Responsibility**: Time-series DB for sensor data, spatial DB for GIS, and data lake for raw logs.

## Monorepo Structure
- `apps/`: Deployable applications.
- `packages/`: Shared libraries.
- `docs/`: Documentation.

## Deployment
- Containerized using Docker.
- Orchestrated via Kubernetes or Docker Compose.
