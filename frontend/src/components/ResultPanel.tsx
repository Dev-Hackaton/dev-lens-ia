import type { AnalysisResult } from "../types/analysis.types";

interface Props {
  result: AnalysisResult | null;
}

export default function ResultPanel({ result }: Props) {
  if (!result) {
    return <div className="card text-muted">No analysis yet</div>;
  }

  const scoreColor =
    result.score.total >= 8
      ? "score-high"
      : result.score.total >= 5
        ? "score-medium"
        : "score-low";

  return (
    <div className="panel scroll">
      {/* METRICS */}{" "}
      <div className="grid-2">
        {" "}
        <div className="card">
          {" "}
          <span className="label">Total Issues</span>{" "}
          <div className="value">{result.metrics.total_issues}</div>{" "}
        </div>
        <div className="card">
          <span className="label">Critical Issues</span>
          <div className="value">{result.metrics.critical_issues}</div>
        </div>
        <div className="card">
          <span className="label">Code Quality</span>
          <div className="value">{result.metrics.code_quality}</div>
        </div>
        <div className="card">
          <span className="label">Dev Level</span>
          <div className="value">{result.dev_level.level}</div>
        </div>
      </div>
      {/* SCORE */}
      <div className="card score-card">
        <div className="score-header">
          <span className="label">Overall Score</span>
          <span className={`score-badge ${scoreColor}`}>
            {result.score.total}
          </span>
        </div>

        <div className="score-bar">
          <div
            className={`score-fill ${scoreColor}`}
            style={{ width: `${result.score.total * 10}%` }}
          />
        </div>
      </div>
      {/* SCORE BREAKDOWN */}
      <div className="card">
        <span className="label">Score Breakdown</span>

        <div className="issues">
          {result.charts.score_breakdown.map((item, idx) => (
            <div key={idx}>
              <div className="row-between">
                <span className="text-muted">{item.label}</span>
                <span>{item.value}</span>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${item.value * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* INSIGHTS */}
      <div className="card">
        <span className="label">Insights</span>

        <div className="issues">
          {result.insights.map((insight, idx) => (
            <div key={idx} className={`issue ${insight.type}`}>
              <div className="issue-header">
                <span className="issue-title">{insight.title}</span>
              </div>
              <p className="text-muted">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* ISSUES */}
      {result.issues.length > 0 && (
        <div className="card">
          <span className="label">Issues</span>

          <div className="issues">
            {result.issues.map((issue, idx) => (
              <div key={idx} className={`issue ${issue.severity}`}>
                <div className="issue-header">
                  <span className="issue-title">{issue.title}</span>

                  <span className={`badge ${issue.severity}`}>
                    {issue.severity}
                  </span>
                </div>

                <p className="text-muted">{issue.description}</p>

                <div className="issue-fix">{issue.fix}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* IMPROVEMENTS */}
      <div className="card">
        <span className="label">Improvements</span>
        <ul className="list">
          {result.improvements.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>
      {/* EXPLANATION */}
      <div className="card">
        <span className="label">Explanation</span>
        <p className="text-muted">{result.explanation_simple}</p>
      </div>
      {/* SENIOR VERSION */}
      {result.senior_version && (
        <div className="card">
          <span className="label">Improved Code</span>
          <pre className="code-block">
            <code>{result.senior_version}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
