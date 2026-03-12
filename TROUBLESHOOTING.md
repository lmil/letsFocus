# Troubleshooting: Validation Error on Pause / Resume Button

## Problem

Clicking the **Pause** or **Resume** button in the timer returns a `400 Validation Failed` error from the backend:

```json
{
  "status": "error",
  "message": "Validation Failed",
  "errors": [
    {
      "expected": "object",
      "code": "invalid_type",
      "path": [],
      "message": "Invalid input: expected object, received undefined"
    }
  ]
}
```

---

## Root Cause

The backend uses Zod to validate request bodies on the pause and resume endpoints:

- `PATCH /api/sessions/:id/pause` — requires `{ pausedAt: string }` (ISO datetime)
- `PATCH /api/sessions/:id/resume` — requires `{ resumedAt: string }` (ISO datetime)

But the frontend was calling these endpoints **without a request body**, causing the validator to receive `undefined` instead of an object.

---

## How to Identify This Type of Problem

Follow these steps when you see a `Validation Failed` error with `"received undefined"` at `path: []`:

### Step 1 — Read the error carefully

`"path": []` means the error is at the **root level** — the entire request body is missing or wrong, not a specific field inside it.

### Step 2 — Check the frontend service call

Open the relevant service file (e.g., `apps/frontend/src/services/session.service.ts`) and look at the API call that triggered the error.

Check if a **request body is being sent**:

```ts
// BAD — no body sent
await api.patch(`/api/sessions/${sessionId}/pause`);

// GOOD — body included
await api.patch(`/api/sessions/${sessionId}/pause`, {
  pausedAt: new Date().toISOString(),
});
```

### Step 3 — Check the backend validation schema

Open the backend validators file (e.g., `apps/backend/src/validators/session.validators.ts`) and find the schema for the endpoint:

```ts
export const pauseSessionSchema = z.object({
  pausedAt: z.iso.datetime(),
});

export const resumeSessionSchema = z.object({
  resumedAt: z.iso.datetime(),
});
```

This tells you exactly what fields are required in the request body.

### Step 4 — Cross-reference the route

Open the route file (e.g., `apps/backend/src/routes/session.routes.ts`) to confirm which schema is applied to which endpoint:

```ts
router.patch("/:id/pause", validate(pauseSessionSchema), pauseSession);
router.patch("/:id/resume", validate(resumeSessionSchema), resumeSession);
```

### Step 5 — Check the controller

Open the controller (e.g., `apps/backend/src/controllers/session.controller.ts`) to see what fields are actually used from `req.body`:

```ts
const { pausedAt } = req.body;
```

This confirms what data the backend expects and uses.

---

## Fix

### File: `apps/frontend/src/services/session.service.ts`

**pauseSession** — add `pausedAt` to the request body:

```ts
// Before
export async function pauseSession(sessionId: string): Promise<void> {
  await api.patch(`/api/sessions/${sessionId}/pause`);
}

// After
export async function pauseSession(sessionId: string): Promise<void> {
  await api.patch(`/api/sessions/${sessionId}/pause`, {
    pausedAt: new Date().toISOString(),
  });
}
```

**resumeSession** — add `resumedAt` to the request body:

```ts
// Before
export async function resumeSession(sessionId: string): Promise<void> {
  await api.patch(`/api/sessions/${sessionId}/resume`);
}

// After
export async function resumeSession(sessionId: string): Promise<void> {
  await api.patch(`/api/sessions/${sessionId}/resume`, {
    resumedAt: new Date().toISOString(),
  });
}
```

---

## Prevention

When adding a new API endpoint that includes a validation schema on the backend, always check:

1. What fields does the Zod schema require?
2. Is the frontend service function sending all required fields in the request body?
3. For `PATCH` and `POST` requests — never leave the body empty unless the backend explicitly has no validation schema.
