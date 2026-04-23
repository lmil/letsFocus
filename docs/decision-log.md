# Decision Log

## April 20, 2026

**Built:** Removed manual session type tabs from Timer.tsx

**Why:** The backend's completeSession endpoint returns `nextSessionType`, which owns the pomodoro cycle logic. Manual tabs let the frontend override this, causing sessionCount drift between frontend and backend.

**What alternative to consider and why rejected:** Keep the tabs but disable them while the time is running, and sync them with the backedn response when a session completes.
Why rejected: it creates two source of truth for `sessionType`. The backedn owns the cycle logic, but the tabs enables the user to override it, and the cycle will break.

**What breaks if wrong:** If nextSessionType had a bug, the user would have no way to manually correct the session type. Acceptable risk for now-- backend logic is simpple (FOCUS -> SHORT_BREAK, LONG_BREAK cycle)

**Still Unclear:** Nothing on this one, the decision is clear

**Understand block:** Read TkDodo's Practical React Query.
Key insight: sessionType seems like UI state because it lived in useState and tabs let the user change it directly. It's actually server state — the backend owns the cycle logic and returns nextSessionType.
Removing the tabs was the correct fix because it removed the false impression that the user controls something the backend owns.

## April 21, 2026

**Built:** Replace client-side filter/sort in TaskList.tsx with API-driven query params: filter by completion status, search by tutke, sort by date or progress

**Why** Client-side filtering requires fetching the entire dataset upfront. As tasks grow, every page load transfers data the user never sees -- active tasks fetching completed ones, search results fetching non-matches. Moving filtering to the backend means the database does the work it was designed for, and the frontend receives exactly what it needs to render.

**What Breaks if wrong** Keeping client-side filtering also breaks pagination — you can't paginate data you haven't fetched. It breaks search accuracy when combined with pagination — filtering 20 results instead of 500 misses matches. And stale React Query cache means a user filtering for "active" tasks could briefly see completed ones before the next refetch

**What I still don't fully understand** I understand what each layer does in isolation — the controller handles HTTP, the hook manages server state, the service builds API calls — but I'm not always confident about which layer owns a decision. For example: the status → completed mapping lives in useTasks.ts. Could it live in task.service.ts instead? I chose the hook because it's a frontend concern, but I couldn't fully articulate the rule.
