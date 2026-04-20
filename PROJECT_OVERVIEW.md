# LetsFocus — Project Overview

## What Is This?

**LetsFocus** is a full-stack Pomodoro productivity app — a focus timer with integrated task management. Users run timed focus sessions, link them to tasks, and track progress toward completing each task's estimated session count.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, React Router 7, TanStack Query 5, Tailwind CSS 3 |
| Backend | Node.js v22, Express 5, TypeScript |
| Database | PostgreSQL 16, Prisma 6 (ORM) |
| Validation | Zod (both frontend and backend) |
| Monorepo | pnpm workspaces |

---

## Core Features

1. **Pomodoro Timer** — countdown with Focus / Short Break / Long Break cycles, SVG circular progress ring
2. **Task Management** — CRUD, per-task session tracking, progress toward estimated sessions
3. **Timer–Task Integration** — link an active task to a running session, increment `completedSessions` on finish

---

## Progress vs. Schedule

**Today:** April 17, 2026
**Phase 1 planned end:** March 26, 2026 → **~3 weeks behind schedule**

### Completed

| Day | Planned | Status |
|-----|---------|--------|
| Days 1–5 | Foundation (React, Express, PostgreSQL, ESLint, Husky) | ✅ Complete |
| Week 2 | Auth decision → hardcoded `userId` for MVP | ✅ Complete |
| Day 6 | Timer foundation (countdown, SVG ring, pause/reset) | ✅ Complete |
| Day 16 | Task List UI (`TaskList.tsx`, `TaskCard.tsx`) | ✅ Complete (PR #13 merged) |
| Days 21–23 | Backend task API + React Query wiring (`task.service.ts`, `useTasks.ts`) | ✅ Done |
| Day 24 | Task Selector bottom sheet in timer (`TaskSelector.tsx`) | ✅ Done |

### In Progress

| Day | Planned | Status |
|-----|---------|--------|
| Day 7 | Session types, auto-cycle, session counter | 🔄 In progress (`Timer.tsx` has unstaged changes) |
| Day 17 | Task CRUD UI | 🔄 In progress (current branch: `day17/task-crud`) |

### Not Yet Started

| Days | Planned |
|------|---------|
| Day 8 | Timer settings UI (adjustable durations, localStorage) |
| Days 9–11 | Backend session API (`POST /sessions/start`, pause, resume, stop) |
| Day 12 | Connect timer to session backend via React Query |
| Day 13 | Timer modes (strict mode, custom duration) |
| Day 14 | Browser notifications + sound on timer complete |
| Day 15 | Timer polish, accuracy verification, edge case testing |
| Days 18–19 | Task actions (edit, delete, confirm dialog) + filtering/search |
| Day 25 | Link session to task — `taskId` on session, increment `completedSessions` |
| Days 26–29 | Task progress stats, end-to-end testing, final polish |

---

## Key Observations

1. **Timer backend (Days 9–15) is the biggest gap** — session API (start/pause/stop endpoints) and frontend integration are not yet implemented.

2. **Task work is ahead of its day label** — the `day17/task-crud` branch already contains Day 21–24 scope. Multiple planned days were collapsed into single sessions.

3. **`Timer.tsx` and `PomodoroPage.tsx` have uncommitted changes** — Day 7 session-type work is in progress.

4. **Timer settings (Day 8), strict mode (Day 13), notifications (Day 14)** — no evidence of these yet.

---

## Remaining to Close Phase 1

- [ ] Finish session types / auto-cycle in Timer (Day 7)
- [ ] Timer settings UI + localStorage persistence (Day 8)
- [ ] Backend session API (Days 9–11)
- [ ] Connect timer to backend (Day 12)
- [ ] Timer modes + browser notifications (Days 13–14)
- [ ] Task edit/delete actions + filtering/search (Days 18–19)
- [ ] Link sessions to tasks — `taskId` on session, increment `completedSessions` (Day 25)
- [ ] Task progress stats and end-to-end testing (Days 26–29)

---

## Architecture Notes

- **No authentication** — all controllers hard-code `userId = "2fd7af93-3f08-4c3b-a18d-d2cac3996f86"`. Auth is deferred to Phase 4.
- **Soft deletes** — all models use `isActive: Boolean` + `deletedAt: DateTime?`. All queries filter `isActive: true`.
- **API envelope** — all responses follow `{ "status": "success" | "error", "data": { ... } }`.
- **Mobile-first design** — `max-w-sm` layout with bottom navigation.
