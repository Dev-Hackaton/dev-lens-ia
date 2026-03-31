export interface AnalysisResult {
  summary: string;

  overview: {
    language: string;
    framework: string;
    type: string;
  };

  score: {
    readability: number;
    security: number;
    efficiency: number;
    best_practices: number;
    total: number;
  };

  dev_level: {
    level: "junior" | "mid" | "senior";
    reason: string;
  };

  performance: {
    time_complexity: string;
    space_complexity: string;
  };

  issues: {
    title: string;
    severity: "low" | "medium" | "high";
    description: string;
    fix: string;
  }[];

  security_issues: string[];
  possible_bugs: string[];
  performance_issues: string[];

  api: {
    detected: boolean;
    endpoints: string[];
  };

  architecture: {
    patterns: string[];
    type: string;
  };

  improvements: string[];

  test_cases: string[];

  explanation_simple: string;

  senior_version: string;

  charts: {
    score_breakdown: {
      label: string;
      value: number;
    }[];
    issues_by_severity: {
      label: "high" | "medium" | "low";
      value: number;
    }[];
  };

  metrics: {
    total_issues: number;
    critical_issues: number;
    code_quality: "low" | "medium" | "high";
  };

  insights: {
    type: "error" | "warning" | "info";
    title: string;
    description: string;
  }[];
}

export interface HistoryItem {
  id: number;
  timestamp: string;
  code_preview: string;
  result: AnalysisResult;
}
