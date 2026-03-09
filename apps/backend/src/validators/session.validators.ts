import { z } from "zod";

export const startSessionSchema = z.object({
  type: z.enum(["FOCUS", "SHORT_BREAK", "LONG_BREAK"]),
  duration: z.number().int().min(1),
  taskId: z.uuid().optional(),
});

export const pauseSessionSchema = z.object({
  pausedAt: z.iso.datetime(),
});

export const resumeSessionSchema = z.object({
  resumedAt: z.iso.datetime(),
});

export const stopSessionSchema = z.object({
  body: z.object({}).optional(),
});

export const completeSesssionSchema = z.object({
  body: z.object({}).optional(),
});
