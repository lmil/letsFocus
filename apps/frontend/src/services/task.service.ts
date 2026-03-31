import { api } from "../lib/api";

export type Task = {
  id: string;
  title: string;
  estimatedSessions: number;
  completedSessions: number;
  color: string;
  isCompleted: boolean;
  createdAt: string;
};

export interface GetTaskResponse {
  status: string;
  data: Task[];
}

export interface CreateTaskPayload {
  title: string;
  estimatedSessions: number;
  color: string;
}

export interface TaskResponse {
  status: string;
  data: Task;
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get<GetTaskResponse>("/tasks");
  return response.data.data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await api.post<TaskResponse>("/tasks", payload);
  return response.data.data;
}

export async function completeTask(id: string): Promise<Task> {
  const response = await api.patch<TaskResponse>(`/tasks/${id}/complete`);
  return response.data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
