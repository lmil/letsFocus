import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

// Start server
app.listen(PORT, () => {
  console.log(`#### Server running on http://localhost:${PORT}`);
});
