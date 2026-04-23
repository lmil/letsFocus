import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  estimatedSessions: z.number().int().min(1).optional(),
  projectId: z.uuid().optional(),
  taskGroupId: z.uuid().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskIdSchema = z.object({
  id: z.uuid(),
});

export const getTasksSchema = z.object({
  completed: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  projectId: z.uuid().optional(),
  search: z.string().optional(),
  sort: z.enum(["createdAt_desc", "createdAt_asc", "progress_desc"]).optional(),
});
