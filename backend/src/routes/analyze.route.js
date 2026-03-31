import express from "express";
import rateLimit from "express-rate-limit";

import {
  analyzeCode,
  getAnalysisHistory,
  clearAnalysisHistory,
} from "../controllers/analyze.controller.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later",
  },
});

router.use(limiter);

const validateRequest = (req, res, next) => {
  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({
      success: false,
      error: "Invalid input: 'code' must be a string",
    });
  }

  if (code.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: "Code too short",
    });
  }

  if (code.length > 20000) {
    return res.status(413).json({
      success: false,
      error: "Code too large",
    });
  }

  next();
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/", validateRequest, asyncHandler(analyzeCode));

router.get("/history", getAnalysisHistory);

router.delete("/history", clearAnalysisHistory);

export default router;