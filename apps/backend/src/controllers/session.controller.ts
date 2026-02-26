import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

const HARDCODED_USER_ID = "2fd7af93-3f08-4c3b-a18d-d2cac3996f86";

export async function startSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { type, duration, taskId } = req.body;
    const session = await prisma.session.create({
      data: {
        type,
        duration,
        taskId: taskId ?? null,
        userId: HARDCODED_USER_ID,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        sessionId: session.id,
        startedAt: session.startedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}
