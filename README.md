# SurveyFlow

SurveyFlow is a full-stack survey builder for creating, publishing, and analysing surveys.
It includes an admin workspace, a dynamic public survey experience, response collection,
and backend analytics.

## Project at a glance

| Area | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Server state | TanStack Query |
| Forms | React Hook Form with Zod |
| Drag and drop | dnd-kit |
| Charts | Recharts |
| Backend | Express 5, TypeScript |
| Database | PostgreSQL on Neon |
| ORM | Prisma |
| API documentation | Swagger / OpenAPI |

## Repository structure

```text
apps/
  web/       Admin and public React application
  api/       Express API, Prisma schema, migrations, and tests
packages/
  shared/    Shared question, survey, and response types with Zod schemas
docs/
  REQUIREMENTS.md
  deployment.md
```

## Quick start

Use Node.js 20 or newer.

```bash
npm install
npm run dev
```

The root command starts:

- Web application: http://localhost:5173
- API: http://localhost:3001
- API health: http://localhost:3001/api/health
- Swagger UI: http://localhost:3001/api/docs

## Demo account

The demo seed creates a clearly labeled example survey and 15 synthetic responses.

```bash
npm run db:seed
```

- Email: `demo@surveyflow.local`
- Password: `demo-admin-1234`
- Public demo survey: http://localhost:5173/s/customer-experience-survey-demo

The demo survey and responses must be treated as fictional data, not real customers.

## Admin workflows

1. Sign in to the admin workspace.
2. View survey totals and recent activity on the overview dashboard.
3. Create a draft survey.
4. Add text, single-choice, multiple-choice, or rating questions.
5. Edit question settings, options, required flags, and conditional logic.
6. Reorder questions with drag handles.
7. Save the draft or publish it.
8. Open the public survey in a new tab.
9. Review submissions and aggregated analytics.

## Commands

```bash
npm run dev
npm run build
npm test
npm run db:seed
npm run db:generate --workspace=@survey-builder/api
npm run db:migrate --workspace=@survey-builder/api
npm run db:deploy --workspace=@survey-builder/api
```

## Environment

Use one repository-level `.env.local` for actual local values.
Use `.env.example` as the safe setup template. App-local `.env` files are not required.

Never commit `.env.local`, database credentials, JWT secrets, Neon credentials, or other secrets.

## Documentation

- [Requirements](/docs/REQUIREMENTS.md)
- [Deployment](/docs/deployment.md)
