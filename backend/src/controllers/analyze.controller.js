import { runFullAnalysis } from "../core/analysis.orchestrator.js";
import {
  getHistory,
  clearHistory,
} from "../utils/stores/history.store.js";

export const analyzeCode = async (req, res) => {
  const start = Date.now();

  try {
    const { code, options } = req.body;

    const useAI = options?.useAI !== false;

    const result = await runFullAnalysis(code, { useAI });

    return res.status(200).json({
      ...result,
      request: {
        code_length: code.length,
        ai_enabled: useAI,
      },
    });
  } catch (error) {
    const duration = Date.now() - start;

    console.error("Analyze Error:", {
      message: error.message,
      duration_ms: duration,
      route: "/analyze",
    });

    return res.status(500).json({
      success: false,
      error: "Internal analysis error",
      meta: {
        duration_ms: duration,
      },
    });
  }
};

export const getAnalysisHistory = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: getHistory(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve history",
    });
  }
};

export const clearAnalysisHistory = (req, res) => {
  try {
    clearHistory();

    return res.status(200).json({
      success: true,
      message: "History cleared",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to clear history",
    });
  }
};