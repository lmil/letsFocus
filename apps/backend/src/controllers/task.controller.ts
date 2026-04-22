import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await prisma.task.create({
      data: {
        ...req.body,
        userId: "2fd7af93-3f08-4c3b-a18d-d2cac3996f86",
      },
    });
    res.status(201).json({ status: "success", data: task });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { completed, projectId, search, sort } = req.query as {
      completed?: boolean;
      projectId?: string;
      search?: string;
      sort?: "createdAt_desc" | "createdAt_asc" | "progress_desc";
    };

    const orderBy =
      sort === "createdAt_asc"
        ? { createdAt: "asc" as const }
        : sort === "progress_desc"
          ? { completedSessions: "desc" as const }
          : { createdAt: "desc" as const };

    const tasks = await prisma.task.findMany({
      where: {
        userId: "2fd7af93-3f08-4c3b-a18d-d2cac3996f86",
        isActive: true,
        ...(completed !== undefined && { isCompleted: completed }),
        ...(projectId && { projectId }),
        ...(search && { title: { contains: search, mode: "insensitive" } }),
      },
      orderBy,
    });

    res.json({ status: "success", data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        userId: "2fd7af93-3f08-4c3b-a18d-d2cac3996f86",
        isActive: true,
      },
    });
    if (!task) {
      res.status(404).json({ status: "error", message: "Task not found" });
      return;
    }

    res.json({ status: "success", data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        userId: "2fd7af93-3f08-4c3b-a18d-d2cac3996f86",
        isActive: true,
      },
    });
    if (!task) {
      res.status(404).json({ status: "error", message: "Task not found" });
      return;
    }

    const updated = await prisma.task.update({
      where: { id: req.params.id as string },
      data: req.body,
    });

    res.json({ status: "success", data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        userId: "2fd7af93-3f08-4c3b-a18d-d2cac3996f86",
        isActive: true,
      },
    });

    if (!task) {
      res.status(404).json({ status: "error", message: "Task not found" });
      return;
    }

    await prisma.task.update({
      where: {
        id: req.params.id as string,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function completeTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        userId: "2fd7af93-3f08-4c3b-a18d-d2cac3996f86",
        isActive: true,
      },
    });

    if (!task) {
      res.status(404).json({ status: "error", message: "Task not found" });
      return;
    }

    const updated = await prisma.task.update({
      where: { id: req.params.id as string },
      data: {
        isCompleted: !task.isCompleted,
      },
    });

    res.json({ status: "success", data: updated });
  } catch (error) {
    next(error);
  }
}
