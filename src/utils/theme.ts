import type { StageTheme } from '../types/stage';

export type StageThemeTokens = {
  shell: string;
  stageFill: string;
  audienceFill: string;
  outline: string;
  stageTitle: string;
  text: string;
  panel: string;
  panelBorder: string;
};

export function themeTokens(theme: StageTheme): StageThemeTokens {
  switch (theme) {
    case 'light':
      return {
        shell: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        stageFill: '#ffffff',
        audienceFill: '#eff6ff',
        outline: '#94a3b8',
        stageTitle: '#0f172a',
        text: '#0f172a',
        panel: '#ffffff',
        panelBorder: '#cbd5e1',
      };

    case 'blueprint':
      return {
        shell: 'linear-gradient(180deg, #0f2749 0%, #09182f 100%)',
        stageFill: '#103969',
        audienceFill: '#0b2b50',
        outline: '#60a5fa',
        stageTitle: '#dbeafe',
        text: '#dbeafe',
        panel: '#0f172a',
        panelBorder: '#1d4ed8',
      };

    default:
      return {
        shell: 'linear-gradient(180deg, #171b2b 0%, #09090f 100%)',
        stageFill: '#111827',
        audienceFill: '#1e293b',
        outline: '#475569',
        stageTitle: '#f8fafc',
        text: '#e2e8f0',
        panel: '#0b1220',
        panelBorder: '#1f2937',
      };
  }
}
