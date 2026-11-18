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

## Architecture

```text
Browser
  |
  | HTTPS
  v
React SPA (Vercel)
  |
  | JSON / HTTP
  v
Express API (Render)
  |
  | Prisma / PostgreSQL
  v
Neon PostgreSQL
```

### Request flow

1. The React application calls the Express API through `VITE_API_URL`.
2. Express validates request data, applies authentication middleware, and delegates database work
   to Prisma services.
3. Public requests fetch published surveys and submit responses.
4. Admin requests require a JWT or HTTP-only cookie.
5. Prisma reads and writes PostgreSQL tables hosted by Neon.
6. Analytics are aggregated by the backend, not calculated from every response in React.

### Key architecture decisions

- **Monorepo:** npm workspaces keep the frontend, backend, and shared contracts in one repository
  while allowing independent builds.
- **Prisma:** Prisma provides typed PostgreSQL access, migrations, and one schema as the database
  source of truth.
- **Neon:** Neon is used as the managed PostgreSQL provider so the application does not need a
  separate Azure or AWS database service.
- **Vercel + Render:** Vercel hosts the static SPA and Render hosts the stateful Node API. This
  separation is simple and matches the assignment's frontend/backend architecture.
- **Shared Zod schemas:** Shared packages keep question and response contracts consistent across
  the TypeScript workspace.
- **Backend validation:** Public response validation happens on the server because browser
  validation can be bypassed.


## Assumptions and trade-offs

- The application supports one simple admin account rather than organizations or role hierarchies.
- Refresh-token rotation and enterprise session management are intentionally out of scope.
- JWT storage and HTTP-only cookie support provide useful flexibility, but production deployments
  should make a final choice and avoid exposing the same session in both localStorage and cookies.
- The survey JSON schema is stored in PostgreSQL's `Json` column. This is flexible for rapid
  iteration, but less normalized than separate Question and Option tables.
- Reordering and structural changes are saved explicitly rather than with autosave to reduce
  race conditions and accidental writes.
- Render's Free service can spin down after inactivity, creating cold-start delay.


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





