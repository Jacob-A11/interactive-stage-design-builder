export type ElementType =
  | 'spotlight'
  | 'wash'
  | 'speaker'
  | 'chair'
  | 'roundTable'
  | 'podium'
  | 'riser'
  | 'truss'
  | 'backdrop'
  | 'propBox'
  | 'stair';

export type StageTheme = 'midnight' | 'light' | 'blueprint';

export type StageElement = {
  id: string;
  type: ElementType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  locked: boolean;
  hidden: boolean;
  z: number;
};

export type StageSettings = {
  width: number;
  depth: number;
  audienceDepth: number;
  grid: number;
  snapToGrid: boolean;
  showGrid: boolean;
  showAudience: boolean;
  title: string;
  theme: StageTheme;
};

export type ProjectState = {
  stage: StageSettings;
  elements: StageElement[];
};

export type DragState = {
  elementId: string;
  pointerId: number;
  startPoint: { x: number; y: number };
  startElement: { x: number; y: number };
  snapshot: ProjectState;
};

export type LibraryItem = {
  type: ElementType;
  label: string;
  color: string;
  width: number;
  height: number;
  description: string;
};

export type QuickSeats = {
  rows: number;
  columns: number;
  spacingX: number;
  spacingY: number;
};
