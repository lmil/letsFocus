import { useQuery } from "@tanstack/react-query";
import { getTaskById, type TaskWithSessions } from "../services/task.service";

export function useTask(id: string | undefined) {
  return useQuery<TaskWithSessions>({
    queryKey: ["tasks", id],
    queryFn: () => getTaskById(id!),
    enabled: !!id,
  });
}
