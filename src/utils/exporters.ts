import type { ProjectState } from '../types/stage';
import { slugify } from './stage';

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportSvg(svgRef: React.RefObject<SVGSVGElement>, title: string) {
  const svgNode = svgRef.current;
  if (!svgNode) {
    return false;
  }

  const clone = svgNode.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(clone);

  downloadBlob(
    new Blob([source], { type: 'image/svg+xml;charset=utf-8' }),
    `${slugify(title)}.svg`,
  );

  return true;
}

export async function exportPng(
  svgRef: React.RefObject<SVGSVGElement>,
  project: ProjectState,
  worldHeight: number,
) {
  const svgNode = svgRef.current;
  if (!svgNode) {
    return false;
  }

  const clone = svgNode.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const source = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Unable to export PNG.'));
  });

  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = project.stage.width * scale;
  canvas.height = worldHeight * scale;

  const context = canvas.getContext('2d');
  if (!context) {
    URL.revokeObjectURL(url);
    return false;
  }

  context.scale(scale, scale);
  context.fillStyle = project.stage.theme === 'light' ? '#ffffff' : '#050816';
  context.fillRect(0, 0, project.stage.width, worldHeight);
  context.drawImage(image, 0, 0, project.stage.width, worldHeight);
  URL.revokeObjectURL(url);

  const pngBlob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  );

  if (!pngBlob) {
    return false;
  }

  downloadBlob(pngBlob, `${slugify(project.stage.title)}.png`);
  return true;
}

export function exportJson(project: ProjectState) {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: 'application/json',
  });
  downloadBlob(blob, `${slugify(project.stage.title)}.json`);
}
