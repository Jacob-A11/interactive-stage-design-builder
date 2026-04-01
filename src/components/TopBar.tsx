import { Download, Redo2, Save, Undo2, Upload } from 'lucide-react';

type TopBarProps = {
  title: string;
  undoDisabled: boolean;
  redoDisabled: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSaveJson: () => void;
  onLoadJson: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
};

export function TopBar({
  title,
  undoDisabled,
  redoDisabled,
  onUndo,
  onRedo,
  onSaveJson,
  onLoadJson,
  onExportPng,
  onExportSvg,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">Interactive Stage Design Builder</div>
        <h1>{title}</h1>
        <p>
          Build touch-friendly stage layouts with lighting, props, seating,
          export tools, templates, and layer controls.
        </p>
      </div>

      <div className="toolbar">
        <button className="toolbar-button" onClick={onUndo} disabled={undoDisabled}>
          <Undo2 size={18} /> Undo
        </button>
        <button className="toolbar-button" onClick={onRedo} disabled={redoDisabled}>
          <Redo2 size={18} /> Redo
        </button>
        <button className="toolbar-button" onClick={onSaveJson}>
          <Save size={18} /> Save JSON
        </button>
        <button className="toolbar-button" onClick={onLoadJson}>
          <Upload size={18} /> Load JSON
        </button>
        <button className="toolbar-button primary" onClick={onExportPng}>
          <Download size={18} /> Export PNG
        </button>
        <button className="toolbar-button" onClick={onExportSvg}>
          <Download size={18} /> Export SVG
        </button>
      </div>
    </header>
  );
}
