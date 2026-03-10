import { api } from "../lib/api";

export type SessionType = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

export interface StartSessionPayload {
  type: SessionType;
  duration: number;
  taskId?: string;
  startedAt: string;
}

export interface StartSessionResponse {
  status: string;
  data: {
    sessionId: string;
    startedAt: string;
  };
}

export interface CompleteSessionResponse {
  status: string;
  data: {
    session: { id: string; isCompleted: boolean; actualDuration: number };
    task: {
      id: string;
      completedSessions: number;
      isCompleted: boolean;
    } | null;
    nextSessionType: SessionType;
  };
}

export async function startSession(
  payload: StartSessionPayload,
): Promise<StartSessionResponse> {
  const response = await api.post<StartSessionResponse>(
    "/api/sessions/start",
    payload,
  );
  return response.data;
}

export async function pauseSession(sessionId: string): Promise<void> {
  await api.patch(`/api/sessions/${sessionId}/pause`, {
    pausedAt: new Date().toISOString(),
  });
}

export async function resumeSession(sessionId: string): Promise<void> {
  await api.patch(`/api/sessions/${sessionId}/resume`, {
    resumedAt: new Date().toISOString(),
  });
}

export async function stopSession(sessionId: string): Promise<void> {
  await api.patch(`/api/sessions/${sessionId}/stop`);
}

export async function completeSession(
  sessionId: string,
): Promise<CompleteSessionResponse> {
  const response = await api.patch<CompleteSessionResponse>(
    `/api/sessions/${sessionId}/complete`,
  );
  return response.data;
}
