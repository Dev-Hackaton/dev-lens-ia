export const normalizeAnalysis = (aiData) => {
  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  const normalizeSeverity = (s) => {
    const val = (s || "").toLowerCase();
    if (val === "high") return "high";
    if (val === "medium") return "medium";
    return "low";
  };

  if (!aiData || typeof aiData !== "object") {
    return {
      summary: "Invalid AI response",
      error: true,
    };
  }

  const issues = safeArray(aiData.issues || aiData.possible_bugs).map(
    (bug) => ({
      title: bug.title || "Unknown issue",
      severity: normalizeSeverity(bug.severity),
      description: bug.description || "",
      fix: bug.fix || "",
    }),
  );

  return {
    summary: aiData.summary || "No summary available",

    overview: {
      language: aiData.overview?.language || aiData.language || "unknown",
      framework: aiData.overview?.framework || aiData.framework || "unknown",
      type: aiData.overview?.type || aiData.structure || "unknown",
    },

    architecture: {
      patterns: safeArray(aiData.architecture?.patterns),
      type: aiData.architecture?.type || "unknown",
    },

    api: {
      detected: aiData.api?.detected || false,
      endpoints: safeArray(aiData.api?.endpoints),
    },

    performance: {
      time_complexity: aiData.performance?.time_complexity || "unknown",
      space_complexity: aiData.performance?.space_complexity || "unknown",
    },

    score: {
      readability: aiData.score?.readability || 0,
      security: aiData.score?.security || 0,
      efficiency: aiData.score?.efficiency || 0,
      best_practices: aiData.score?.best_practices || 0,
      total: aiData.score?.total || 0,
    },

    dev_level: {
      level: aiData.dev_level?.level || "junior",
      reason: aiData.dev_level?.reason || "",
    },

    issues,

    security_issues: safeArray(aiData.security_issues),
    possible_bugs: safeArray(aiData.possible_bugs),
    performance_issues: safeArray(aiData.performance_issues),

    improvements: safeArray(aiData.improvements),

    test_cases: safeArray(aiData.test_cases),

    explanation_simple: aiData.explanation_simple || "",

    senior_version: aiData.senior_version || "",

    charts: {
      score_breakdown: safeArray(aiData.charts?.score_breakdown).length
        ? aiData.charts.score_breakdown
        : [
            { label: "Readability", value: aiData.score?.readability || 0 },
            { label: "Security", value: aiData.score?.security || 0 },
            { label: "Efficiency", value: aiData.score?.efficiency || 0 },
            {
              label: "Best Practices",
              value: aiData.score?.best_practices || 0,
            },
          ],

      issues_by_severity: safeArray(aiData.charts?.issues_by_severity).length
        ? aiData.charts.issues_by_severity
        : [
            {
              label: "high",
              value: issues.filter((i) => i.severity === "high").length,
            },
            {
              label: "medium",
              value: issues.filter((i) => i.severity === "medium").length,
            },
            {
              label: "low",
              value: issues.filter((i) => i.severity === "low").length,
            },
          ],
    },

    metrics: {
      total_issues: aiData.metrics?.total_issues ?? issues.length,

      critical_issues:
        aiData.metrics?.critical_issues ??
        issues.filter((i) => i.severity === "high").length,

      code_quality:
        aiData.metrics?.code_quality ||
        (aiData.score?.total >= 7
          ? "high"
          : aiData.score?.total >= 4
            ? "medium"
            : "low"),
    },

    insights: safeArray(aiData.insights).length
      ? aiData.insights
      : issues.slice(0, 3).map((i) => ({
          type:
            i.severity === "high"
              ? "error"
              : i.severity === "medium"
                ? "warning"
                : "info",
          title: i.title,
          description: i.description,
        })),
  };
};
