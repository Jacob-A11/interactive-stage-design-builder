import { Grid3X3, Layers, Minus, Move3D, Plus } from 'lucide-react';
import { StageCanvas } from './StageCanvas';
import type { ProjectState, StageElement } from '../types/stage';
import type { StageThemeTokens } from '../utils/theme';

type CanvasPanelProps = {
  svgRef: React.RefObject<SVGSVGElement>;
  viewBox: string;
  worldHeight: number;
  zoom: number;
  project: ProjectState;
  orderedElements: StageElement[];
  selectedId: string | null;
  toast: string;
  stageTokens: StageThemeTokens;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUpdateStage: <K extends keyof ProjectState['stage']>(
    key: K,
    value: ProjectState['stage'][K],
  ) => void;
  onPointerMove: (event: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (pointerId?: number) => void;
  onClearSelection: () => void;
  onStartDrag: (event: React.PointerEvent<SVGGElement>, element: StageElement) => void;
};

export function CanvasPanel({
  svgRef,
  viewBox,
  worldHeight,
  zoom,
  project,
  orderedElements,
  selectedId,
  toast,
  stageTokens,
  onZoomIn,
  onZoomOut,
  onUpdateStage,
  onPointerMove,
  onPointerUp,
  onClearSelection,
  onStartDrag,
}: CanvasPanelProps) {
  return (
    <section className="canvas-panel">
      <div className="canvas-toolbar">
        <div className="zoom-group">
          <button onClick={onZoomOut}>
            <Minus size={18} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn}>
            <Plus size={18} />
          </button>
        </div>

        <div className="canvas-toolbar__right">
          <label className="toggle">
            <input
              type="checkbox"
              checked={project.stage.showGrid}
              onChange={(event) => onUpdateStage('showGrid', event.target.checked)}
            />
            <Grid3X3 size={18} /> Grid
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              checked={project.stage.snapToGrid}
              onChange={(event) =>
                onUpdateStage('snapToGrid', event.target.checked)
              }
            />
            <Move3D size={18} /> Snap
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              checked={project.stage.showAudience}
              onChange={(event) =>
                onUpdateStage('showAudience', event.target.checked)
              }
            />
            <Layers size={18} /> Audience area
          </label>
        </div>
      </div>

      <StageCanvas
        svgRef={svgRef}
        viewBox={viewBox}
        worldHeight={worldHeight}
        zoom={zoom}
        project={project}
        orderedElements={orderedElements}
        selectedId={selectedId}
        stageTokens={stageTokens}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClearSelection={onClearSelection}
        onStartDrag={onStartDrag}
      />

      {toast ? <div className="toast">{toast}</div> : null}
    </section>
  );
}
