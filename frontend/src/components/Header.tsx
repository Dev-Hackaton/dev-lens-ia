import { PanelRight } from "lucide-react";

interface Props {
  onToggleHistory: () => void;
}

export default function Header({ onToggleHistory }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-dot" />
        <span className="logo-text">DevLens</span>
      </div>

      <div className="header-right">
        <button className="btn" onClick={onToggleHistory}>
          <PanelRight size={16} />
          <span>History</span>
        </button>
      </div>
    </header>
  );
}