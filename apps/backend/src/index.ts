import express from "express";
import dotenv from "dotenv";
import cors from "cors";

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

// Start server
app.listen(PORT, () => {
  console.log(`#### Server running on http://localhost:${PORT}`);
});
