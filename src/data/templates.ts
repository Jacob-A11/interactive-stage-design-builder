import type { ProjectState } from '../types/stage';
import { applyZ, cloneState, createTemplateElement } from '../utils/stage';

export const templateProjects: Record<string, ProjectState> = {
  concert: {
    stage: {
      width: 1200,
      depth: 520,
      audienceDepth: 340,
      grid: 20,
      snapToGrid: true,
      showGrid: true,
      showAudience: true,
      title: 'Concert Stage',
      theme: 'midnight',
    },
    elements: [
      createTemplateElement('backdrop', 600, 60, 0, 1.35),
      createTemplateElement('truss', 300, 90, 0, 1.3),
      createTemplateElement('truss', 900, 90, 0, 1.3),
      createTemplateElement('spotlight', 220, 120),
      createTemplateElement('spotlight', 380, 120),
      createTemplateElement('spotlight', 820, 120),
      createTemplateElement('spotlight', 980, 120),
      createTemplateElement('speaker', 70, 340),
      createTemplateElement('speaker', 1130, 340),
      createTemplateElement('riser', 600, 305, 0, 1.2),
      createTemplateElement('propBox', 450, 330),
      createTemplateElement('propBox', 750, 330),
      createTemplateElement('stair', 510, 465),
      createTemplateElement('stair', 690, 465, 180),
    ],
  },
  conference: {
    stage: {
      width: 1200,
      depth: 440,
      audienceDepth: 420,
      grid: 20,
      snapToGrid: true,
      showGrid: true,
      showAudience: true,
      title: 'Conference Setup',
      theme: 'light',
    },
    elements: [
      createTemplateElement('backdrop', 600, 70, 0, 1.45),
      createTemplateElement('truss', 600, 120, 0, 1.2),
      createTemplateElement('podium', 600, 270),
      createTemplateElement('speaker', 120, 280),
      createTemplateElement('speaker', 1080, 280),
      createTemplateElement('wash', 280, 150),
      createTemplateElement('wash', 920, 150),
      createTemplateElement('roundTable', 200, 590),
      createTemplateElement('roundTable', 400, 590),
      createTemplateElement('roundTable', 600, 590),
      createTemplateElement('roundTable', 800, 590),
      createTemplateElement('roundTable', 1000, 590),
    ],
  },
  gala: {
    stage: {
      width: 1260,
      depth: 460,
      audienceDepth: 420,
      grid: 20,
      snapToGrid: true,
      showGrid: true,
      showAudience: true,
      title: 'Gala / Awards Night',
      theme: 'blueprint',
    },
    elements: [
      createTemplateElement('backdrop', 630, 75, 0, 1.5),
      createTemplateElement('podium', 630, 250),
      createTemplateElement('spotlight', 230, 140),
      createTemplateElement('spotlight', 1030, 140),
      createTemplateElement('wash', 430, 130),
      createTemplateElement('wash', 830, 130),
      createTemplateElement('speaker', 120, 320),
      createTemplateElement('speaker', 1140, 320),
      createTemplateElement('truss', 630, 120, 0, 1.22),
    ],
  },
};

export function makeDefaultProject(): ProjectState {
  const base = cloneState(templateProjects.concert);

  return {
    stage: {
      ...base.stage,
      title: 'Custom Stage Layout',
    },
    elements: applyZ(base.elements),
  };
}
