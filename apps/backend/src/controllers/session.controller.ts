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

export async function pauseSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params as { id: string };
    const { pausedAt } = req.body;

    const session = await prisma.session.update({
      where: { id },
      data: { pausedAt: new Date(pausedAt) },
    });

    res.json({
      status: "success",
      data: {
        sessionId: session.id,
        pausedAt: session.pausedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function resumeSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params as { id: string };

    const session = await prisma.session.update({
      where: { id },
      data: { pausedAt: null },
    });

    res.json({
      status: "success",
      data: {
        sessionId: session.id,
        resumedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function stopSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const session = await prisma.session.findFirst({
      where: { id, userId: HARDCODED_USER_ID, isActive: true },
    });

    if (!session) {
      res.status(404).json({ status: "error", message: "Session not found" });
      return;
    }

    const now = new Date();
    const actualDuration = Math.round(
      (now.getTime() - session.startedAt.getTime()) / 1000,
    );

    const updated = await prisma.session.update({
      where: { id },
      data: {
        isCompleted: false,
        actualDuration,
        endedAt: now,
        isActive: false,
      },
    });

    res.json({ status: "success", data: updated });
  } catch (error) {
    next(error);
  }
}

export async function getSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params as { id: string };
    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      res.status(404).json({
        status: "error",
        message: "Session not found",
      });
      return;
    }

    res.json({
      status: "success",
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function completeSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const session = await prisma.session.findFirst({
      where: { id, userId: HARDCODED_USER_ID, isActive: true },
    });

    if (!session) {
      res.status(404).json({ status: "error", message: "Session not found" });
      return;
    }

    const now = new Date();
    const actualDuration = Math.round(
      (now.getTime() - session.startedAt.getTime()) / 1000,
    );

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        isCompleted: true,
        actualDuration,
        endedAt: now,
        isActive: false,
      },
    });

    res.json({ status: "success", data: { session: updatedSession } });
  } catch (error) {
    next(error);
  }
}
