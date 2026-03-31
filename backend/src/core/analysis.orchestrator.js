import { analyzeWithGemini } from "../services/gemini.service.js";
import { normalizeAnalysis } from "../utils/normalizers/analysis.normalizer.js";
import { saveToHistory } from "../utils/stores/history.store.js";

export const runFullAnalysis = async (code, options = {}) => {
  const start = Date.now();

  let aiAnalysis = null;
  let aiError = null;

  if (!code || typeof code !== "string") {
    return {
      success: false,
      error: "Invalid code input",
    };
  }

  if (code.length < 10) {
    return {
      success: false,
      error: "Code too short to analyze",
    };
  }

  try {
    aiAnalysis = await analyzeWithGemini(code);
  } catch (error) {
    aiError = error.message;
  }

  if (!aiAnalysis || aiAnalysis.error) {
    aiAnalysis = {
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
      performance_issues: [],
      api: {
        detected: false,
        endpoints: [],
      },
      architecture: {
        patterns: [],
        type: "unknown",
      },
      test_cases: [],
      explanation_simple: "",
      senior_version: "",
      error: true,
    };
  }

  const finalResult = normalizeAnalysis(aiAnalysis);

  const end = Date.now();

  saveToHistory({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    code_preview: code.slice(0, 200),
    result: finalResult,
  });

  return {
    success: true,
    timestamp: new Date().toISOString(),

    meta: {
      duration_ms: end - start,
      ai_used: !aiError,
      ai_error: aiError,
    },

    data: finalResult,
  };
};
