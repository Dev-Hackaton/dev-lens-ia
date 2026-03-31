import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

import { analyzeCode, getHistory } from "../api/analyze.api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import HistoryDrawer from "../components/HistoryDrawer";
import ResultPanel from "../components/ResultPanel";

import type { AnalysisResult, HistoryItem } from "../types/analysis.types";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [analysesCount, setAnalysesCount] = useState(0);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setStatus("loading");

    try {
      const res = await analyzeCode(code);
      setResult(res.data.data);

      const h = await getHistory();
      setHistory(h.data.data);

      setAnalysesCount((c) => c + 1);
    } catch (e) {
      console.error(e);
    }

    setStatus("idle");
  };

  const handleSelect = (item: HistoryItem) => {
    setCode(item.code_preview);
    setResult(item.result);
    setOpen(false);
  };

  useEffect(() => {
    getHistory().then((res) => setHistory(res.data.data));
  }, []);

  return (
    <div className="app">
      <Header onToggleHistory={() => setOpen(!open)} />

      <div className="layout">

        <div className="panel-left">
          <div className="editor-container">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                fontFamily: "JetBrains Mono",
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        <div className="panel-right">
          <ResultPanel result={result} />
        </div>
      </div>

      <Footer status={status} analysesCount={analysesCount} />

      <HistoryDrawer
        open={open}
        history={history}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}