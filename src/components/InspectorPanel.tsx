import {
  BringToFront,
  CircleOff,
  Copy,
  Eye,
  EyeOff,
  Layers,
  Lock,
  LockOpen,
  RotateCw,
  Trash2,
  Zap,
} from 'lucide-react';
import type { ProjectState, StageElement, StageTheme } from '../types/stage';
import { normalizeColor } from '../utils/stage';

type InspectorPanelProps = {
  project: ProjectState;
  orderedElements: StageElement[];
  selectedId: string | null;
  selectedElement: StageElement | null;
  onSelectElement: (id: string) => void;
  onUpdateStage: <K extends keyof ProjectState['stage']>(
    key: K,
    value: ProjectState['stage'][K],
  ) => void;
  onPatchSelected: (partial: Partial<StageElement>, message?: string) => void;
  onDuplicateSelected: () => void;
  onBringSelectedToFront: () => void;
  onToggleLockSelected: () => void;
  onToggleVisibilitySelected: () => void;
  onDeleteSelected: () => void;
};

export function InspectorPanel({
  project,
  orderedElements,
  selectedId,
  selectedElement,
  onSelectElement,
  onUpdateStage,
  onPatchSelected,
  onDuplicateSelected,
  onBringSelectedToFront,
  onToggleLockSelected,
  onToggleVisibilitySelected,
  onDeleteSelected,
}: InspectorPanelProps) {
  return (
    <aside className="panel">
      <div className="panel-header">
        <span>
          <Layers size={18} /> Inspector
        </span>
      </div>

      <div className="section-label">Stage settings</div>
      <div className="field-grid">
        <label>
          Title
          <input
            type="text"
            value={project.stage.title}
            onChange={(event) => onUpdateStage('title', event.target.value)}
          />
        </label>

        <label>
          Theme
          <select
            value={project.stage.theme}
            onChange={(event) =>
              onUpdateStage('theme', event.target.value as StageTheme)
            }
          >
            <option value="midnight">Midnight</option>
            <option value="light">Light</option>
            <option value="blueprint">Blueprint</option>
          </select>
        </label>

        <label>
          Stage width
          <input
            type="number"
            min={600}
            max={2400}
            step={20}
            value={project.stage.width}
            onChange={(event) => onUpdateStage('width', Number(event.target.value))}
          />
        </label>

        <label>
          Stage depth
          <input
            type="number"
            min={300}
            max={1200}
            step={20}
            value={project.stage.depth}
            onChange={(event) => onUpdateStage('depth', Number(event.target.value))}
          />
        </label>

        <label>
          Audience depth
          <input
            type="number"
            min={120}
            max={1200}
            step={20}
            value={project.stage.audienceDepth}
            onChange={(event) =>
              onUpdateStage('audienceDepth', Number(event.target.value))
            }
          />
        </label>

        <label>
          Grid size
          <input
            type="number"
            min={10}
            max={100}
            step={5}
            value={project.stage.grid}
            onChange={(event) => onUpdateStage('grid', Number(event.target.value))}
          />
        </label>
      </div>

      <div className="section-label">Selected object</div>
      {selectedElement ? (
        <>
          <div className="field-grid">
            <label>
              Label
              <input
                type="text"
                value={selectedElement.label}
                onChange={(event) =>
                  onPatchSelected({ label: event.target.value }, 'Label updated.')
                }
              />
            </label>

            <label>
              Color
              <input
                type="color"
                value={normalizeColor(selectedElement.color)}
                onChange={(event) =>
                  onPatchSelected({ color: event.target.value }, 'Color updated.')
                }
              />
            </label>

            <label>
              X
              <input
                type="number"
                value={Math.round(selectedElement.x)}
                onChange={(event) =>
                  onPatchSelected({ x: Number(event.target.value) }, 'X position updated.')
                }
              />
            </label>

            <label>
              Y
              <input
                type="number"
                value={Math.round(selectedElement.y)}
                onChange={(event) =>
                  onPatchSelected({ y: Number(event.target.value) }, 'Y position updated.')
                }
              />
            </label>
          </div>

          <div className="range-group">
            <label>
              Width <span>{Math.round(selectedElement.width)}</span>
              <input
                type="range"
                min={20}
                max={260}
                value={selectedElement.width}
                onChange={(event) =>
                  onPatchSelected({ width: Number(event.target.value) }, 'Width updated.')
                }
              />
            </label>

            <label>
              Height <span>{Math.round(selectedElement.height)}</span>
              <input
                type="range"
                min={20}
                max={260}
                value={selectedElement.height}
                onChange={(event) =>
                  onPatchSelected(
                    { height: Number(event.target.value) },
                    'Height updated.',
                  )
                }
              />
            </label>

            <label>
              Rotation <span>{Math.round(selectedElement.rotation)}°</span>
              <input
                type="range"
                min={0}
                max={359}
                value={selectedElement.rotation}
                onChange={(event) =>
                  onPatchSelected(
                    { rotation: Number(event.target.value) },
                    'Rotation updated.',
                  )
                }
              />
            </label>
          </div>

          <div className="action-row">
            <button onClick={onDuplicateSelected}>
              <Copy size={18} /> Duplicate
            </button>
            <button onClick={onBringSelectedToFront}>
              <BringToFront size={18} /> Front
            </button>
            <button onClick={onToggleLockSelected}>
              {selectedElement.locked ? <LockOpen size={18} /> : <Lock size={18} />}
              {selectedElement.locked ? 'Unlock' : 'Lock'}
            </button>
            <button onClick={onToggleVisibilitySelected}>
              {selectedElement.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
              {selectedElement.hidden ? 'Show' : 'Hide'}
            </button>
            <button className="danger" onClick={onDeleteSelected}>
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Zap size={18} /> Select an item on the stage to edit properties.
        </div>
      )}

      <div className="section-label">Layers</div>
      <div className="layer-list">
        {[...orderedElements].reverse().map((element) => {
          const isSelected = element.id === selectedId;

          return (
            <button
              key={element.id}
              className={`layer-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectElement(element.id)}
            >
              <span
                className="layer-dot"
                style={{ background: element.color }}
              />
              <span className="layer-main">
                <strong>{element.label}</strong>
                <small>{element.type}</small>
              </span>
              {element.locked ? <Lock size={16} /> : null}
              {element.hidden ? <CircleOff size={16} /> : null}
              <RotateCw size={16} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
