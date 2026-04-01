import type { StageElement } from '../types/stage';

type StageShapeProps = {
  element: StageElement;
  selected: boolean;
  textColor: string;
};

export function StageShape({ element, selected, textColor }: StageShapeProps) {
  const commonStroke =
    selected ? '#22c55e' : element.type === 'speaker' ? '#64748b' : '#0f172a';
  const strokeWidth = selected ? 4 : 2;

  return (
    <g>
      {element.type === 'spotlight' && (
        <>
          <circle
            r={Math.min(element.width, element.height) / 2.6}
            fill={element.color}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <path
            d={`M 0 ${-element.height / 2.5} L ${element.width / 7} ${
              -element.height / 3.4
            } L ${element.width / 2.3} ${-element.height / 2.3}`}
            stroke={element.color}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M 0 ${-element.height / 2.5} L ${-element.width / 7} ${
              -element.height / 3.4
            } L ${-element.width / 2.3} ${-element.height / 2.3}`}
            stroke={element.color}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M 0 ${element.height / 2.2} L 0 ${element.height / 1.45}`}
            stroke={commonStroke}
            strokeWidth={3}
          />
        </>
      )}

      {element.type === 'wash' && (
        <>
          <rect
            x={-element.width / 2}
            y={-element.height / 2}
            width={element.width}
            height={element.height}
            rx={14}
            fill={element.color}
            fillOpacity={0.25}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <circle
            r={Math.min(element.width, element.height) / 3.1}
            fill={element.color}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <path
            d={`M ${-element.width / 3} ${element.height / 2} L ${
              element.width / 3
            } ${element.height / 2}`}
            stroke={commonStroke}
            strokeWidth={3}
          />
        </>
      )}

      {element.type === 'speaker' && (
        <>
          <rect
            x={-element.width / 2}
            y={-element.height / 2}
            width={element.width}
            height={element.height}
            rx={10}
            fill={element.color}
            stroke={selected ? '#22c55e' : '#94a3b8'}
            strokeWidth={strokeWidth}
          />
          <circle
            cy={-element.height / 6}
            r={element.width / 6}
            fill="#1f2937"
            stroke="#cbd5e1"
            strokeWidth={2}
          />
          <circle
            cy={element.height / 5}
            r={element.width / 4.2}
            fill="#0f172a"
            stroke="#cbd5e1"
            strokeWidth={2}
          />
        </>
      )}

      {element.type === 'chair' && (
        <>
          <rect
            x={-element.width / 2}
            y={-element.height / 2}
            width={element.width}
            height={element.height / 2}
            rx={8}
            fill={element.color}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <rect
            x={-element.width / 2.7}
            y={0}
            width={element.width / 1.35}
            height={element.height / 2.2}
            rx={8}
            fill={element.color}
            fillOpacity={0.9}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {element.type === 'roundTable' && (
        <>
          <circle
            r={Math.min(element.width, element.height) / 2}
            fill={element.color}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <circle
            r={Math.min(element.width, element.height) / 6}
            fill="#f8fafc"
            stroke={commonStroke}
            strokeWidth={2}
          />
        </>
      )}

      {element.type === 'podium' && (
        <>
          <path
            d={`M ${-element.width / 2} ${element.height / 2} L ${
              -element.width / 3
            } ${-element.height / 2} L ${element.width / 3} ${
              -element.height / 2
            } L ${element.width / 2} ${element.height / 2} Z`}
            fill={element.color}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <rect
            x={-element.width / 2.8}
            y={-element.height / 2 - 8}
            width={element.width / 1.4}
            height={10}
            rx={4}
            fill={commonStroke}
          />
        </>
      )}

      {element.type === 'riser' && (
        <>
          <rect
            x={-element.width / 2}
            y={-element.height / 2}
            width={element.width}
            height={element.height}
            rx={6}
            fill={element.color}
            fillOpacity={0.92}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <path
            d={`M ${-element.width / 2} ${0} L ${element.width / 2} ${0}`}
            stroke="#cbd5e1"
            strokeDasharray="8 6"
            strokeWidth={2}
          />
        </>
      )}

      {element.type === 'truss' && (
        <>
          <rect
            x={-element.width / 2}
            y={-element.height / 2}
            width={element.width}
            height={element.height}
            rx={5}
            fill={element.color}
            fillOpacity={0.18}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          {Array.from({ length: 7 }).map((_, index) => {
            const x = -element.width / 2 + (index * element.width) / 6;

            return (
              <g key={index}>
                <path
                  d={`M ${x} ${-element.height / 2} L ${
                    x + element.width / 6
                  } ${element.height / 2}`}
                  stroke={commonStroke}
                  strokeWidth={2}
                />
                <path
                  d={`M ${x} ${element.height / 2} L ${
                    x + element.width / 6
                  } ${-element.height / 2}`}
                  stroke={commonStroke}
                  strokeWidth={2}
                />
              </g>
            );
          })}
        </>
      )}

      {element.type === 'backdrop' && (
        <>
          <rect
            x={-element.width / 2}
            y={-element.height / 2}
            width={element.width}
            height={element.height}
            rx={6}
            fill={element.color}
            fillOpacity={0.25}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <path
            d={`M ${-element.width / 2} 0 L ${element.width / 2} 0`}
            stroke={commonStroke}
            strokeWidth={3}
            strokeDasharray="10 6"
          />
        </>
      )}

      {element.type === 'propBox' && (
        <>
          <rect
            x={-element.width / 2}
            y={-element.height / 2}
            width={element.width}
            height={element.height}
            rx={8}
            fill={element.color}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <path
            d={`M ${-element.width / 4} ${-element.height / 2} L ${
              element.width / 4
            } ${element.height / 2}`}
            stroke="#dcfce7"
            strokeWidth={2.5}
          />
          <path
            d={`M ${element.width / 4} ${-element.height / 2} L ${
              -element.width / 4
            } ${element.height / 2}`}
            stroke="#dcfce7"
            strokeWidth={2.5}
          />
        </>
      )}

      {element.type === 'stair' && (
        <>
          <rect
            x={-element.width / 2}
            y={-element.height / 2}
            width={element.width}
            height={element.height}
            rx={6}
            fill={element.color}
            fillOpacity={0.18}
            stroke={commonStroke}
            strokeWidth={strokeWidth}
          />
          <path
            d={`M ${-element.width / 2 + 6} ${element.height / 2 - 4} H ${
              -element.width / 6
            } V ${element.height / 6} H ${element.width / 6} V ${
              -element.height / 6
            } H ${element.width / 2 - 6}`}
            fill="none"
            stroke={commonStroke}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </>
      )}

      {selected && (
        <rect
          x={-element.width / 2 - 10}
          y={-element.height / 2 - 10}
          width={element.width + 20}
          height={element.height + 20}
          rx={10}
          fill="none"
          stroke="#22c55e"
          strokeWidth={3}
          strokeDasharray="8 6"
        />
      )}

      <text
        y={element.height / 2 + 24}
        textAnchor="middle"
        fontSize={14}
        fontWeight={600}
        fill={textColor}
      >
        {element.label}
      </text>
    </g>
  );
}
