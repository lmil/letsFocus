import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./lib/prisma";
import { errorHandler } from "./middleware/errorHandler";

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

app.get("/api/db-test", async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "success",
      message: "Database connection is working!",
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.method} ${req.url} not found`,
  });
});

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`#### Server running on http://localhost:${PORT}`);
});
