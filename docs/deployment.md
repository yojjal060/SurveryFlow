# Deployment

## Web — Vercel

Deploy `apps/web` with Vercel. Set `VITE_API_URL` to the public API URL.

## API — Render

Use `render.yaml` at the repository root. Set `CORS_ORIGIN` to the Vercel web origin and `DATABASE_URL` to the Neon PostgreSQL connection string.

Render runs Prisma client generation before building and exposes the `/health` health check.

## Database — Neon

Create a Neon PostgreSQL database, copy its pooled or direct PostgreSQL connection string into `DATABASE_URL`, and keep the value as a deployment secret.

Run migrations only after reviewing them:

```bash
npm run prisma:migrate --workspace=@survey-builder/api
```

Do not commit `.env` files or database credentials.
