import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import analyzeRoute from "./routes/analyze.route.js";
import { ENV } from "./config/env.js";

dotenv.config();

const app = express();

app.use(morgan("combined"));

const allowedOrigins = [
  ENV.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: "Too many requests, try again later",
  },
});

app.use("/api/analyze", apiLimiter, analyzeRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Global Error:", {
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});