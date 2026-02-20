import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// log incoming request immediately
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  next();
});

app.use(morgan("dev"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "LetsFocus Backend API is running",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "success",
      message: "Database connection is working!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed!",
    });
  }
});

// Create a user (test endpoint)
app.post("/api/users", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create user",
    });
  }
});

// Create a task (test endpoint)
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, userId } = req.body;

    // Simple validation
    if (!title || !userId) {
      return res.status(400).json({
        status: "error",
        message: "Title and userId are required",
      });
    }

    // Create task in database
    const task = await prisma.task.create({
      data: {
        title,
        userId,
      },
    });

    res.status(201).json({
      status: "success",
      data: task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create task",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`#### Server running on http://localhost:${PORT}`);
});
