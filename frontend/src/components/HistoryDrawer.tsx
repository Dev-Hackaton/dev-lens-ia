import type { HistoryItem } from "../types/analysis.types";
import { X, Clock } from "lucide-react";

interface Props {
  open: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
}

export default function HistoryDrawer({
  open,
  history,
  onClose,
  onSelect,
}: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        className="drawer-overlay"
        onClick={onClose}
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        className="drawer"
        style={{
          transform: open ? "translateX(0)" : "translateX(110%)",
        }}
      >
        <div className="drawer-header row-between">
          <span>History</span>

          <button className="btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="scroll drawer-content">
          {history.length === 0 && (
            <div className="text-muted">No history yet</div>
          )}

          {history.map((item) => (
            <div
              key={item.id}
              className="card history-item"
              onClick={() => onSelect(item)}
            >
              <div className="row-between">
                <div className="row gap-sm text-muted">
                  <Clock size={12} />
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="history-dot" />
              </div>

              <pre className="history-code">{item.code_preview}</pre>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
