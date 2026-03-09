import { z } from "zod";
import { Request, Response, NextFunction, Router } from "express";
import {
  startSession,
  pauseSession,
  resumeSession,
  stopSession,
  getSession,
  completeSession,
} from "../controllers/session.controller";
import {
  startSessionSchema,
  pauseSessionSchema,
  resumeSessionSchema,
} from "../validators/session.validators";

const router = Router();

function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        status: "error",
        message: "Validation Failed",
        errors: result.error.issues,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

router.post("/start", validate(startSessionSchema), startSession);
router.patch("/:id/pause", validate(pauseSessionSchema), pauseSession);
router.patch("/:id/resume", validate(resumeSessionSchema), resumeSession);
router.patch("/:id/stop", stopSession);
router.patch("/:id/complete", completeSession);
router.get("/:id", getSession);

export default router;
