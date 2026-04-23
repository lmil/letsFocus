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

export interface GetTasksParams {
  completed?: boolean;
  search?: string;
  sort?: "createdAt_desc" | "createdAt_asc" | "progress_desc";
}

export async function getTasks(params?: GetTasksParams): Promise<Task[]> {
  const query = new URLSearchParams();

  if (params?.search) query.set("search", params.search);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.completed !== undefined) query.set("completed", String(params.completed));

  const queryString = query.toString();
  const url = queryString ? `/tasks?${queryString}` : "/tasks";

  const response = await api.get<GetTaskResponse>(url);
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
