import { StageShape } from './StageShape';
import type { ProjectState, StageElement } from '../types/stage';
import type { StageThemeTokens } from '../utils/theme';

type StageCanvasProps = {
  svgRef: React.RefObject<SVGSVGElement>;
  viewBox: string;
  worldHeight: number;
  zoom: number;
  project: ProjectState;
  orderedElements: StageElement[];
  selectedId: string | null;
  stageTokens: StageThemeTokens;
  onPointerMove: (event: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (pointerId?: number) => void;
  onClearSelection: () => void;
  onStartDrag: (event: React.PointerEvent<SVGGElement>, element: StageElement) => void;
};

export function StageCanvas({
  svgRef,
  viewBox,
  worldHeight,
  zoom,
  project,
  orderedElements,
  selectedId,
  stageTokens,
  onPointerMove,
  onPointerUp,
  onClearSelection,
  onStartDrag,
}: StageCanvasProps) {
  return (
    <div className="canvas-shell" style={{ background: stageTokens.shell }}>
      <svg
        ref={svgRef}
        className="stage-canvas"
        viewBox={viewBox}
        style={{ transform: `scale(${zoom})` }}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => onPointerUp(event.pointerId)}
        onPointerLeave={() => onPointerUp()}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClearSelection();
          }
        }}
      >
        <defs>
          <pattern
            id="gridPattern"
            width={project.stage.grid}
            height={project.stage.grid}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${project.stage.grid} 0 L 0 0 0 ${project.stage.grid}`}
              fill="none"
              stroke={project.stage.theme === 'light' ? '#cbd5e1' : '#334155'}
              strokeWidth="1"
              opacity="0.45"
            />
          </pattern>

          <linearGradient id="audienceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={project.stage.theme === 'light' ? '#eff6ff' : '#14213d'}
            />
            <stop
              offset="100%"
              stopColor={project.stage.theme === 'light' ? '#dbeafe' : '#0f172a'}
            />
          </linearGradient>
        </defs>

        <rect
          x={0}
          y={0}
          width={project.stage.width}
          height={worldHeight}
          fill="transparent"
        />

        {project.stage.showGrid && (
          <rect
            x={0}
            y={0}
            width={project.stage.width}
            height={worldHeight}
            fill="url(#gridPattern)"
          />
        )}

        <rect
          x={0}
          y={0}
          width={project.stage.width}
          height={project.stage.depth}
          rx={18}
          fill={stageTokens.stageFill}
          stroke={stageTokens.outline}
          strokeWidth={4}
        />

        <text
          x={project.stage.width / 2}
          y={40}
          textAnchor="middle"
          fill={stageTokens.stageTitle}
          fontSize={26}
          fontWeight={700}
        >
          {project.stage.title}
        </text>

        <text
          x={project.stage.width / 2}
          y={74}
          textAnchor="middle"
          fill={stageTokens.stageTitle}
          fontSize={14}
          opacity={0.72}
        >
          STAGE AREA
        </text>

        {project.stage.showAudience && (
          <g>
            <rect
              x={0}
              y={project.stage.depth}
              width={project.stage.width}
              height={project.stage.audienceDepth}
              fill="url(#audienceGradient)"
              stroke={stageTokens.outline}
              strokeWidth={2}
              strokeDasharray="10 8"
            />
            <text
              x={project.stage.width / 2}
              y={project.stage.depth + 36}
              textAnchor="middle"
              fill={stageTokens.stageTitle}
              fontSize={14}
              opacity={0.72}
            >
              AUDIENCE / SEATING ZONE
            </text>
          </g>
        )}

        {orderedElements.map((element) => {
          if (element.hidden) {
            return null;
          }

          const isSelected = selectedId === element.id;

          return (
            <g
              key={element.id}
              transform={`translate(${element.x} ${element.y}) rotate(${element.rotation})`}
              onPointerDown={(event) => onStartDrag(event, element)}
              style={{ cursor: element.locked ? 'not-allowed' : 'grab' }}
            >
              <StageShape
                element={element}
                selected={isSelected}
                textColor={stageTokens.text}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
