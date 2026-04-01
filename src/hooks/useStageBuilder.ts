import { useEffect, useMemo, useRef, useState } from 'react';
import { library } from '../data/library';
import { makeDefaultProject, templateProjects } from '../data/templates';
import type {
  DragState,
  LibraryItem,
  ProjectState,
  QuickSeats,
  StageElement,
  StageSettings,
} from '../types/stage';
import { exportJson, exportPng, exportSvg } from '../utils/exporters';
import { themeTokens } from '../utils/theme';
import {
  applyZ,
  clamp,
  cloneState,
  createId,
  normalizeColor,
  snap,
  stageCenterY,
} from '../utils/stage';

const STORAGE_KEY = 'stage-builder-project-v2';

function normalizeProjectState(parsed: ProjectState): ProjectState {
  return {
    stage: {
      width: parsed.stage.width ?? 1200,
      depth: parsed.stage.depth ?? 520,
      audienceDepth: parsed.stage.audienceDepth ?? 340,
      grid: parsed.stage.grid ?? 20,
      snapToGrid: parsed.stage.snapToGrid ?? true,
      showGrid: parsed.stage.showGrid ?? true,
      showAudience: parsed.stage.showAudience ?? true,
      title: parsed.stage.title ?? 'Custom Stage Layout',
      theme: parsed.stage.theme ?? 'midnight',
    },
    elements: applyZ(parsed.elements ?? []),
  };
}

function getInitialProjectState() {
  if (typeof window === 'undefined') {
    return makeDefaultProject();
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return makeDefaultProject();
  }

  try {
    const parsed = JSON.parse(saved) as ProjectState;
    if (!parsed.stage || !Array.isArray(parsed.elements)) {
      return makeDefaultProject();
    }

    return normalizeProjectState(parsed);
  } catch {
    return makeDefaultProject();
  }
}

export function useStageBuilder() {
  const [project, setProject] = useState<ProjectState>(getInitialProjectState);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [undoStack, setUndoStack] = useState<ProjectState[]>([]);
  const [redoStack, setRedoStack] = useState<ProjectState[]>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [toast, setToast] = useState(
    'Tap an object to edit it. Drag directly on the stage to position it.',
  );
  const [quickSeats, setQuickSeats] = useState<QuickSeats>({
    rows: 5,
    columns: 10,
    spacingX: 42,
    spacingY: 42,
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stageTokens = themeTokens(project.stage.theme);
  const worldHeight =
    project.stage.depth + (project.stage.showAudience ? project.stage.audienceDepth : 80);
  const viewBox = `0 0 ${project.stage.width} ${worldHeight}`;

  const orderedElements = useMemo(
    () => [...project.elements].sort((a, b) => a.z - b.z),
    [project.elements],
  );

  const selectedElement =
    project.elements.find((element) => element.id === selectedId) ?? null;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function commit(next: ProjectState, message?: string) {
    setUndoStack((previous) => [...previous, cloneState(project)].slice(-60));
    setRedoStack([]);
    setProject({
      stage: { ...next.stage },
      elements: applyZ(next.elements),
    });

    if (message) {
      setToast(message);
    }
  }

  function updateStage<K extends keyof StageSettings>(
    key: K,
    value: StageSettings[K],
    message = 'Stage settings updated.',
  ) {
    commit(
      {
        ...project,
        stage: {
          ...project.stage,
          [key]: value,
        },
      },
      message,
    );
  }

  function addElement(item: LibraryItem) {
    const nextElement: StageElement = {
      id: createId(),
      type: item.type,
      label: item.label,
      x: project.stage.width / 2,
      y: stageCenterY(project.stage.depth),
      width: item.width,
      height: item.height,
      rotation: 0,
      color: item.color,
      locked: false,
      hidden: false,
      z: project.elements.length + 1,
    };

    const nextProject = {
      ...project,
      elements: [...project.elements, nextElement],
    };

    commit(nextProject, `${item.label} added.`);
    setSelectedId(nextElement.id);
  }

  function patchSelected(partial: Partial<StageElement>, message = 'Item updated.') {
    if (!selectedElement) {
      return;
    }

    const nextProject = {
      ...project,
      elements: project.elements.map((element) =>
        element.id === selectedElement.id ? { ...element, ...partial } : element,
      ),
    };

    commit(nextProject, message);
  }

  function deleteSelected() {
    if (!selectedElement) {
      return;
    }

    const nextProject = {
      ...project,
      elements: project.elements.filter((element) => element.id !== selectedElement.id),
    };

    commit(nextProject, `${selectedElement.label} removed.`);
    setSelectedId(null);
  }

  function duplicateSelected() {
    if (!selectedElement) {
      return;
    }

    const copiedElement: StageElement = {
      ...selectedElement,
      id: createId(),
      label: `${selectedElement.label} Copy`,
      x: selectedElement.x + 32,
      y: selectedElement.y + 32,
      z: project.elements.length + 1,
    };

    commit(
      {
        ...project,
        elements: [...project.elements, copiedElement],
      },
      'Item duplicated.',
    );
    setSelectedId(copiedElement.id);
  }

  function bringSelectedToFront() {
    if (!selectedElement) {
      return;
    }

    const otherElements = project.elements.filter(
      (element) => element.id !== selectedElement.id,
    );

    commit(
      {
        ...project,
        elements: [...otherElements, { ...selectedElement }],
      },
      'Item moved to front.',
    );
  }

  function toggleLockSelected() {
    if (!selectedElement) {
      return;
    }

    patchSelected(
      { locked: !selectedElement.locked },
      selectedElement.locked ? 'Item unlocked.' : 'Item locked.',
    );
  }

  function toggleVisibilitySelected() {
    if (!selectedElement) {
      return;
    }

    patchSelected(
      { hidden: !selectedElement.hidden },
      selectedElement.hidden ? 'Item shown.' : 'Item hidden.',
    );
  }

  function performUndo() {
    if (undoStack.length === 0) {
      return;
    }

    const previous = undoStack[undoStack.length - 1];
    setUndoStack((stack) => stack.slice(0, -1));
    setRedoStack((stack) => [...stack, cloneState(project)].slice(-60));
    setProject(cloneState(previous));
    setToast('Undo applied.');
  }

  function performRedo() {
    if (redoStack.length === 0) {
      return;
    }

    const next = redoStack[redoStack.length - 1];
    setRedoStack((stack) => stack.slice(0, -1));
    setUndoStack((stack) => [...stack, cloneState(project)].slice(-60));
    setProject(cloneState(next));
    setToast('Redo applied.');
  }

  function pointerToSvgPoint(
    event: React.PointerEvent<SVGElement> | PointerEvent,
  ) {
    const svg = svgRef.current;
    if (!svg) {
      return null;
    }

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) {
      return null;
    }

    return point.matrixTransform(screenCTM.inverse());
  }

  function startDrag(
    event: React.PointerEvent<SVGGElement>,
    element: StageElement,
  ) {
    if (element.locked) {
      setSelectedId(element.id);
      setToast('This item is locked. Unlock it in the inspector to move it.');
      return;
    }

    const point = pointerToSvgPoint(event);
    if (!point) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    setSelectedId(element.id);
    setDragState({
      elementId: element.id,
      pointerId: event.pointerId,
      startPoint: { x: point.x, y: point.y },
      startElement: { x: element.x, y: element.y },
      snapshot: cloneState(project),
    });
  }

  function handleCanvasPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragState) {
      return;
    }

    const point = pointerToSvgPoint(event);
    if (!point) {
      return;
    }

    const deltaX = point.x - dragState.startPoint.x;
    const deltaY = point.y - dragState.startPoint.y;

    setProject((current) => ({
      ...current,
      elements: current.elements.map((element) => {
        if (element.id !== dragState.elementId) {
          return element;
        }

        const nextX = dragState.startElement.x + deltaX;
        const nextY = dragState.startElement.y + deltaY;
        const x = current.stage.snapToGrid ? snap(nextX, current.stage.grid) : nextX;
        const y = current.stage.snapToGrid ? snap(nextY, current.stage.grid) : nextY;

        return {
          ...element,
          x: clamp(x, element.width / 2, current.stage.width - element.width / 2),
          y: clamp(y, element.height / 2, worldHeight - element.height / 2),
        };
      }),
    }));
  }

  function finishDrag(pointerId?: number) {
    if (!dragState) {
      return;
    }

    if (pointerId !== undefined && pointerId !== dragState.pointerId) {
      return;
    }

    setUndoStack((previous) => [...previous, dragState.snapshot].slice(-60));
    setRedoStack([]);
    setDragState(null);
    setToast('Position updated.');
  }

  function addSeatingBlock() {
    const { rows, columns, spacingX, spacingY } = quickSeats;
    const chairDefinition = library.find((entry) => entry.type === 'chair');
    if (!chairDefinition) {
      return;
    }

    const totalWidth = (columns - 1) * spacingX;
    const startX = project.stage.width / 2 - totalWidth / 2;
    const startY = project.stage.depth + 75;

    const seats: StageElement[] = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        seats.push({
          id: createId(),
          type: 'chair',
          label: `Seat ${row + 1}-${column + 1}`,
          x: startX + column * spacingX,
          y: startY + row * spacingY,
          width: chairDefinition.width,
          height: chairDefinition.height,
          rotation: 0,
          color: chairDefinition.color,
          locked: false,
          hidden: false,
          z: project.elements.length + seats.length + 1,
        });
      }
    }

    commit(
      {
        ...project,
        elements: [...project.elements, ...seats],
      },
      `${rows * columns} seats added.`,
    );
  }

  function loadTemplate(name: 'concert' | 'conference' | 'gala') {
    const base = cloneState(templateProjects[name]);
    commit(
      {
        stage: { ...base.stage },
        elements: applyZ(base.elements),
      },
      `${base.stage.title} template loaded.`,
    );
    setSelectedId(null);
  }

  function resetProject() {
    commit(makeDefaultProject(), 'Project reset.');
    setSelectedId(null);
  }

  async function handleExportSvg() {
    const ok = await exportSvg(svgRef, project.stage.title);
    if (ok) {
      setToast('SVG exported.');
    }
  }

  async function handleExportPng() {
    try {
      const ok = await exportPng(svgRef, project, worldHeight);
      if (ok) {
        setToast('PNG exported.');
      }
    } catch {
      setToast('PNG export failed.');
    }
  }

  function handleSaveJson() {
    exportJson(project);
    setToast('Project JSON exported.');
  }

  function triggerJsonImport() {
    fileInputRef.current?.click();
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();

    try {
      const parsed = JSON.parse(text) as ProjectState;
      if (!parsed.stage || !Array.isArray(parsed.elements)) {
        throw new Error('Invalid file');
      }

      commit(normalizeProjectState(parsed), 'Project imported successfully.');
      setSelectedId(null);
    } catch {
      setToast('Import failed. Please choose a valid stage-builder JSON file.');
    } finally {
      event.target.value = '';
    }
  }

  function zoomIn() {
    setZoom((current) => Math.min(2, Number((current + 0.1).toFixed(1))));
  }

  function zoomOut() {
    setZoom((current) => Math.max(0.6, Number((current - 0.1).toFixed(1))));
  }

  return {
    project,
    selectedId,
    selectedElement,
    zoom,
    toast,
    quickSeats,
    svgRef,
    fileInputRef,
    undoStack,
    redoStack,
    stageTokens,
    worldHeight,
    viewBox,
    orderedElements,
    setSelectedId,
    setQuickSeats,
    updateStage,
    addElement,
    patchSelected,
    deleteSelected,
    duplicateSelected,
    bringSelectedToFront,
    toggleLockSelected,
    toggleVisibilitySelected,
    performUndo,
    performRedo,
    handleCanvasPointerMove,
    finishDrag,
    startDrag,
    addSeatingBlock,
    loadTemplate,
    resetProject,
    handleExportSvg,
    handleExportPng,
    handleSaveJson,
    triggerJsonImport,
    handleImport,
    zoomIn,
    zoomOut,
    normalizeColor,
  };
}
