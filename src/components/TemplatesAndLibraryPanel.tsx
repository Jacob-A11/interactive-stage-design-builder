import { Armchair, Settings2 } from 'lucide-react';
import { library } from '../data/library';
import type { LibraryItem, QuickSeats } from '../types/stage';

type TemplatesAndLibraryPanelProps = {
  quickSeats: QuickSeats;
  onQuickSeatsChange: React.Dispatch<React.SetStateAction<QuickSeats>>;
  onAddElement: (item: LibraryItem) => void;
  onGenerateSeating: () => void;
  onLoadTemplate: (name: 'concert' | 'conference' | 'gala') => void;
  onResetProject: () => void;
};

export function TemplatesAndLibraryPanel({
  quickSeats,
  onQuickSeatsChange,
  onAddElement,
  onGenerateSeating,
  onLoadTemplate,
  onResetProject,
}: TemplatesAndLibraryPanelProps) {
  return (
    <aside className="panel">
      <div className="panel-header">
        <span>
          <Settings2 size={18} /> Templates &amp; Objects
        </span>
      </div>

      <div className="template-grid">
        <button onClick={() => onLoadTemplate('concert')}>Concert</button>
        <button onClick={() => onLoadTemplate('conference')}>Conference</button>
        <button onClick={() => onLoadTemplate('gala')}>Gala</button>
        <button className="ghost" onClick={onResetProject}>
          Reset
        </button>
      </div>

      <div className="section-label">Library</div>
      <div className="library-grid">
        {library.map((item) => (
          <button
            key={item.type}
            className="library-card"
            onClick={() => onAddElement(item)}
          >
            <div
              className="library-swatch"
              style={{ background: item.color }}
            />
            <div>
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="section-label">Quick seating block</div>
      <div className="field-grid compact">
        <label>
          Rows
          <input
            type="number"
            min={1}
            max={20}
            value={quickSeats.rows}
            onChange={(event) =>
              onQuickSeatsChange((current) => ({
                ...current,
                rows: Number(event.target.value),
              }))
            }
          />
        </label>

        <label>
          Columns
          <input
            type="number"
            min={1}
            max={30}
            value={quickSeats.columns}
            onChange={(event) =>
              onQuickSeatsChange((current) => ({
                ...current,
                columns: Number(event.target.value),
              }))
            }
          />
        </label>

        <label>
          X spacing
          <input
            type="number"
            min={24}
            max={120}
            value={quickSeats.spacingX}
            onChange={(event) =>
              onQuickSeatsChange((current) => ({
                ...current,
                spacingX: Number(event.target.value),
              }))
            }
          />
        </label>

        <label>
          Y spacing
          <input
            type="number"
            min={24}
            max={120}
            value={quickSeats.spacingY}
            onChange={(event) =>
              onQuickSeatsChange((current) => ({
                ...current,
                spacingY: Number(event.target.value),
              }))
            }
          />
        </label>
      </div>

      <button className="full-button accent" onClick={onGenerateSeating}>
        <Armchair size={18} /> Generate seating block
      </button>
    </aside>
  );
}
