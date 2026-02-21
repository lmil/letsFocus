# LetsFocus

A Pomodoro-based focus timer with task and project management. Built with React, Node.js, Express, and PostgreSQL.

## Tech Stack

**Frontend** — React 19, TypeScript, Vite, Tailwind CSS, React Query, Axios  
**Backend** — Node.js, Express 5, TypeScript, Prisma ORM  
**Database** — PostgreSQL 16

## Project Structure

```
letsfocus/
├── apps/
│   ├── frontend/          # React app (localhost:5173)
│   └── backend/           # Express API (localhost:3000)
├── package.json           # Workspace root
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js v22+
- pnpm v10+
- PostgreSQL 16

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/lmil/letsfocus.git
cd letsfocus
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Configure environment variables**

```bash
cp apps/backend/.env.example apps/backend/.env
```

Update `DATABASE_URL` in `apps/backend/.env` with your PostgreSQL connection string.

**4. Set up the database**

```bash
cd apps/backend
pnpm exec prisma migrate dev
pnpm exec prisma db seed
```

**5. Start the development servers**

```bash
# From the project root — run each in a separate terminal
pnpm dev:frontend    # starts on localhost:5173
pnpm dev:backend     # starts on localhost:3000
```

## API Endpoints

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| GET    | /api/health | Health check  |
| POST   | /api/tasks  | Create a task |

## Development

**Linting**

```bash
pnpm --filter frontend exec eslint .
pnpm --filter backend exec eslint .
```

**Formatting**

```bash
pnpm --filter frontend exec prettier --check "**/*.{ts,tsx,css,json}"
pnpm --filter backend exec prettier --check "**/*.{ts,json}"
```

Git hooks run automatically on every commit via Husky + lint-staged.

## Roadmap

- Week 1 ✅ — Project setup, database schema, integration testing, dev workflow
- Week 2 — Authentication
- Week 3-4 — Timer feature (Pomodoro)
- Week 5-6 — Task management
- Week 7-8 — Projects
- Week 9+ — Analytics, reports, deployment
