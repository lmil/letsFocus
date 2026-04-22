import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, completeTask, deleteTask } from "../services/task.service";
import type { CreateTaskPayload } from "../services/task.service";
import { useEffect, useState } from "react";

export type TaskFilters = {
  status: "all" | "active" | "completed";
  search: string;
  sort: "createdAt_desc" | "createdAt_asc" | "progress_desc";
};

export function useTasks(
  filters: TaskFilters = {
    status: "all",
    search: "",
    sort: "createdAt_desc",
  },
) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const queryClient = useQueryClient();

  const apiParams = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.sort !== "createdAt_desc" && { sort: filters.sort }),
    ...(filters.status === "active" && { completed: false }),
    ...(filters.status === "completed" && { completed: true }),
  };

  const tasksQuery = useQuery({
    queryKey: ["tasks", filters.status, debouncedSearch, filters.sort],
    queryFn: () => getTasks(apiParams),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    createTask: createMutation.mutateAsync,
    completeTask: completeMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
  };
}
