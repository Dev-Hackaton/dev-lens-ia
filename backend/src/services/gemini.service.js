import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import { ENV } from "../config/env.js";
import { ANALYZE_PROMPT } from "../promts/analyze.prompt.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const cache = new Map();
const MAX_CACHE_SIZE = 50;

const getCacheKey = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

const extractJSON = (text) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

const validateAIResponse = (data) => {
  if (!data || typeof data !== "object") return false;

  if (!data.summary) return false;
  if (!data.score || typeof data.score !== "object") return false;

  return true;
};

const sanitizeAIResponse = (parsed) => {
  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  if (parsed.senior_version) {
    parsed.senior_version = parsed.senior_version
      .replace(/```[\s\S]*?\n/g, "")
      .replace(/```/g, "")
      .trim()
      .slice(0, 1500);
  }

  parsed.flow = safeArray(parsed.flow);
  parsed.risks = safeArray(parsed.risks);
  parsed.improvements = safeArray(parsed.improvements);
  parsed.security_issues = safeArray(parsed.security_issues);
  parsed.possible_bugs = safeArray(parsed.possible_bugs);
  parsed.test_cases = safeArray(parsed.test_cases);
  parsed.patterns_detected = safeArray(parsed.patterns_detected);

  const {
    readability = 0,
    security = 0,
    efficiency = 0,
    best_practices = 0,
  } = parsed.score || {};

  parsed.score = {
    readability,
    security,
    efficiency,
    best_practices,
    total: Math.round(
      (readability + security + efficiency + best_practices) / 4
    ),
  };

  return parsed;
};

export const analyzeWithGemini = async (code, context = {}) => {
  const key = getCacheKey(code);

  if (cache.has(key)) {
    return cache.get(key);
  }

  if (!code || code.length < 10) {
    throw new Error("Invalid or empty code");
  }

  if (code.length > 20000) {
    throw new Error("Code too large for AI analysis");
  }

  const prompt = ANALYZE_PROMPT(code, context);

  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    const result = await model.generateContent(prompt, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const rawText = result.response.text();

    const parsed = extractJSON(rawText);

    if (!parsed || !validateAIResponse(parsed)) {
      throw new Error("Invalid AI structure");
    }

    const cleanData = sanitizeAIResponse(parsed);

    if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, cleanData);

    return cleanData;
  } catch (error) {
    console.error("Gemini Error:", error.message);

    return {
      summary: "AI analysis failed",
      flow: [],
      risks: ["AI could not analyze code"],
      improvements: [],
      score: {
        readability: 0,
        security: 0,
        efficiency: 0,
        best_practices: 0,
        total: 0,
      },
      dev_level: {
        level: "unknown",
        reason: "AI failed",
      },
      performance: {
        time_complexity: "unknown",
        space_complexity: "unknown",
      },
      security_issues: [],
      possible_bugs: [],
      test_cases: [],
      patterns_detected: [],
      senior_version: "",
      error: true,
    };
  }
};