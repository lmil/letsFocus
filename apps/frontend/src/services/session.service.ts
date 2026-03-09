import api from "../lib/api";

export type SessionType = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

export interface StartSessionPayload {
  type: SessionType;
  duration: number;
  taskId?: string;
}

export interface StartSessionResponse {
  status: string;
  data: {
    id: string;
    data: {
      id: string;
      type: SessionType;
      duration: number;
      startedAt: string;
    };
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
  const response = await api.post<StartSessionResponse>("/sessions/start", {
    payload,
  });
  return response.data;
}

export async function pauseSession(sessionId: string): Promise<void> {
  await api.patch(`/session/${sessionId}/pause`);
}

export async function resumeSession(sessionId: string): Promise<void> {
  await api.patch(`/sessions/${sessionId}/resume`);
}

export async function stopSession(sessionId: string): Promise<void> {
  await api.patcj(`/sessions/${sessionId}/stop`);
}

export async function completeSession(
  sessionId: string,
): Promise<CompleteSessionResponse> {
  const response = await api.patch<CompleteSessionResponse>(
    `/sessions/${sessionId}/complete`,
  );
  return response.data;
}
