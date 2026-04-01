import { library } from '../data/library';
import type { ElementType, ProjectState, StageElement } from '../types/stage';

export function createId() {
  return `el_${Math.random().toString(36).slice(2, 10)}`;
}

export function createTemplateElement(
  type: ElementType,
  x: number,
  y: number,
  rotation = 0,
  scale = 1,
): StageElement {
  const item = library.find((entry) => entry.type === type);
  if (!item) {
    throw new Error(`Missing library entry for ${type}`);
  }

  return {
    id: createId(),
    type,
    label: item.label,
    x,
    y,
    width: item.width * scale,
    height: item.height * scale,
    rotation,
    color: item.color,
    locked: false,
    hidden: false,
    z: 0,
  };
}

export function cloneState(state: ProjectState): ProjectState {
  return {
    stage: { ...state.stage },
    elements: state.elements.map((element) => ({ ...element })),
  };
}

export function applyZ(elements: StageElement[]) {
  return elements.map((element, index) => ({ ...element, z: index + 1 }));
}

export function snap(value: number, size: number) {
  return Math.round(value / size) * size;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

export function normalizeColor(color: string) {
  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
    return color;
  }
  return '#64748b';
}

export function stageCenterY(depth: number) {
  return Math.min(depth / 2, depth - 60);
}
