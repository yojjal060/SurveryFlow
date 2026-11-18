# Integration Plan

## Backend
- Project: `apps/api`
- Dev command: `npm run dev --workspace=@survey-builder/api`
- Port: `3001`
- Build: `npm run build --workspace=@survey-builder/api`
- Health: `/health`
- Docs: `/docs`, `/openapi.json`

## Frontend
- Project: `apps/web`
- Build: `npm run build --workspace=@survey-builder/web`
- Dev: `npm run dev --workspace=@survey-builder/web`
- API seam: none implemented; add one API client module only when integration begins
- Mock files: none

## API routes
- `GET /health`
- `GET /ready`
- `GET /openapi.json`
- `GET /docs`

## Database
- PostgreSQL via Prisma
- Schema: `apps/api/prisma/schema.prisma`
- Migration directory: `apps/api/prisma/migrations`
- Migration tool: Prisma CLI
- Environment: `DATABASE_URL`
- Generate: `npm run prisma:generate --workspace=@survey-builder/api`
- Validate: `npm run prisma:validate --workspace=@survey-builder/api`
- Deploy: `npm run prisma:migrate --workspace=@survey-builder/api`
- Explicit requirement: no seed data

## Shared package
- Package: `@survey-builder/shared`
- Location: `packages/shared/src/index.ts`
- Health response schema/type export

## Services
- Essential: web SPA, Express API, Prisma/PostgreSQL
- Enhancement: deployment platform configuration
