# Prisma PostgreSQL

Set `DATABASE_URL` to a PostgreSQL or Neon connection string before running migrations.

```bash
npm run prisma:generate --workspace=@survey-builder/api
npm run prisma:validate --workspace=@survey-builder/api
npm run prisma:migrate --workspace=@survey-builder/api
```

No seed scripts or survey entities are included.
