import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
} from "../controllers/task.controller";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  getTasksSchema,
} from "../validators/task.validators";
import { ZodType } from "zod";
import { RequestHandler } from "express";

function validate<T extends ZodType>(
  schema: T,
  source: "body" | "params" | "query" = "body",
): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({ status: "error", issues: result.error.issues });
      return;
    }
    req[source] = result.data;
    next();
  };
}

const router = Router();
router.post("/", validate(createTaskSchema), createTask);
router.get("/", validate(getTasksSchema, "query"), getTasks);
router.get("/:id", validate(taskIdSchema, "params"), getTaskById);
router.patch(
  "/:id",
  validate(taskIdSchema, "params"),
  validate(updateTaskSchema),
  updateTask,
);
router.delete("/:id", validate(taskIdSchema, "params"), deleteTask);
router.patch("/:id/complete", validate(taskIdSchema, "params"), completeTask);

export default router;
