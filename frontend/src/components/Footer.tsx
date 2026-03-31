import { useEffect, useState } from "react";
import { Circle, Loader2, Clock, BarChart3 } from "lucide-react";

interface Props {
  status?: "idle" | "loading";
  analysesCount?: number;
}

export default function Footer({
  status = "idle",
  analysesCount = 0,
}: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className="row-between"
      style={{
        height: 40,
        padding: "0 16px",
        borderTop: "1px solid var(--border)",
        fontSize: 12,
        color: "var(--text-muted)",
      }}
    >
      <div className="row gap-md">
        <div className="row gap-sm">
          {status === "loading" ? (
            <Loader2 size={12} />
          ) : (
            <Circle size={10} />
          )}
          <span>
            {status === "loading" ? "Analyzing" : "Ready"}
          </span>
        </div>

        <div className="row gap-sm">
          <Clock size={12} />
          <span>{seconds}s</span>
        </div>

        <div className="row gap-sm">
          <BarChart3 size={12} />
          <span>{analysesCount}</span>
        </div>
      </div>

      <div className="row gap-md">
        <span>v0.1.0</span>
        <a
          href="https://github.com/TU-USUARIO"
          target="_blank"
          className="text-muted"
          style={{ textDecoration: "none" }}
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}