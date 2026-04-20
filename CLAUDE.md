# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Root (run from repo root):**
```bash
pnpm install              # Install all workspace dependencies
pnpm dev:frontend         # Start frontend dev server (port 5173)
pnpm dev:backend          # Start backend dev server (port 3000)
```

**Frontend:**
```bash
pnpm --filter frontend build    # TypeScript check + Vite production build
pnpm --filter frontend lint     # ESLint
```

**Backend:**
```bash
pnpm --filter backend build     # TypeScript compilation → dist/
pnpm --filter backend start     # Run compiled output
```

**Database (run from `apps/backend/`):**
```bash
pnpm exec prisma migrate dev    # Apply migrations
pnpm exec prisma db seed        # Seed with initial data
pnpm exec prisma studio         # Open Prisma Studio UI
```

**Prerequisites:** Node v22+, pnpm v10+, PostgreSQL 16. Backend requires `apps/backend/.env` with `DATABASE_URL=postgresql://user@localhost:5432/letsfocus?schema=public`.

Pre-commit hooks (Husky + lint-staged) auto-run ESLint fix + Prettier on staged `.ts`/`.tsx` files.

## Architecture

### Monorepo Layout

```
letsfocus/ (pnpm workspace)
├── apps/frontend/   React 19 SPA (Vite)
└── apps/backend/    Express 5 REST API
```

### Frontend (`apps/frontend/src/`)

**Stack:** React 19, TypeScript, Vite, React Router 7, TanStack React Query 5, Axios, Tailwind CSS 3, Zod

**Project structure:**
```
src/
├── main.tsx                        # App entry point, QueryClient + Router setup
├── App.tsx                         # Route definitions
├── lib/
│   └── api.ts                      # Axios instance (baseURL=http://localhost:3000/api)
├── services/
│   ├── task.service.ts             # getTasks, createTask, completeTask, deleteTask
│   └── session.service.ts          # Session API calls
├── hooks/
│   └── useTasks.ts                 # React Query wrapper (useQuery + mutations, queryKey: ["tasks"])
├── pages/
│   ├── PomodoroPage.tsx            # / — timer + active task
│   ├── ManagePage.tsx              # /manage — task list management
│   ├── CalendarPage.tsx            # /calendar
│   ├── ReportPage.tsx              # /report
│   └── SettingsPage.tsx            # /settings
├── feature/
│   ├── tasks/
│   │   ├── TaskCard.tsx            # Single task row with complete/delete actions
│   │   ├── TaskForm.tsx            # Modal overlay form for creating tasks
│   │   └── TaskList.tsx            # List of TaskCards, wired to useTasks hook
│   └── timer/
│       └── Timer.tsx               # Pomodoro countdown timer component
├── tasks/
│   └── TaskSelector.tsx            # Bottom sheet with search for selecting active task
└── components/
    └── BottomNav.tsx               # Shared bottom navigation bar
```

**Data flow:** `lib/api.ts` → `services/*.service.ts` → `hooks/use*.ts` → components/pages

**Routing (React Router 7):** `/` → PomodoroPage, `/manage` → ManagePage, `/calendar`, `/report`, `/settings`

**Design:** Mobile-first (max-w-sm), bottom navigation, Tailwind inline styles.

### Backend (`apps/backend/src/`)

**Stack:** Node.js v22+, Express 5, TypeScript, Prisma 6, PostgreSQL 16, Zod

**Project structure:**
```
src/
├── index.ts                        # Express app entry, route mounting, CORS, Morgan
├── lib/
│   └── prisma.ts                   # Singleton PrismaClient instance
├── routes/
│   ├── task.routes.ts              # Task endpoints with validate() middleware applied
│   └── session.routes.ts           # Session endpoints
├── controllers/
│   ├── task.controller.ts          # getTasks, createTask, updateTask, deleteTask, completeTask
│   └── session.controller.ts       # Session business logic
├── middleware/
│   └── errorHandler.ts             # Global Express error handler
└── validators/
    ├── task.validators.ts          # createTaskSchema, updateTaskSchema, taskIdSchema, getTasksSchema
    └── session.validators.ts       # Session Zod schemas
```

**Request lifecycle:**
1. `routes/*.ts` — mount endpoints, apply `validate<T>(schema, source)` middleware inline
2. `validate<T>()` — generic Zod middleware on `body`/`params`/`query`; returns 400 + Zod issues on failure
3. `controllers/*.ts` — business logic, Prisma queries via `lib/prisma.ts`, `next(error)` for errors
4. `middleware/errorHandler.ts` — global error handler

**API response envelope:**
```json
{ "status": "success" | "error", "data": { ... } }
```

### Database Schema (Prisma)

Key models: `User`, `Project`, `TaskGroup` (self-referencing for unlimited nesting via `parentGroupId`), `Task`, `Session`, `Settings`.

All models use soft deletes: `isActive: Boolean` + `deletedAt: DateTime?`. All queries filter `isActive: true`.

`Task` fields of note: `estimatedSessions`, `completedSessions`, `isCompleted`, `color`, optional `projectId` and `taskGroupId`.

`Session` types: `FOCUS`, `SHORT_BREAK`, `LONG_BREAK`.

## Current State & Known Limitations

- **Authentication is not implemented.** All backend controllers hard-code `userId = "2fd7af93-3f08-4c3b-a18d-d2cac3996f86"`.
- Development is in early stages (Week 1: infra/schema done; remaining features in progress on feature branches).