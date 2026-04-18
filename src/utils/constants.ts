import type { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Trabajo', icon: 'Briefcase', color: '#1CB0F6', isCustom: false },
  { id: 'study', name: 'Estudio', icon: 'GraduationCap', color: '#CE82FF', isCustom: false },
  { id: 'home', name: 'Hogar', icon: 'Home', color: '#FF9600', isCustom: false },
  { id: 'health', name: 'Salud', icon: 'Heart', color: '#FF4B4B', isCustom: false },
  { id: 'personal', name: 'Personal', icon: 'User', color: '#FF86D0', isCustom: false },
];

export const XP_VALUES = {
  low: 10,
  medium: 20,
  high: 35,
  allDayBonus: 50,
} as const;

export const LEVEL_XP_BASE = 100;
export const LEVEL_XP_MULTIPLIER = 1.3;

export function getXpForLevel(level: number): number {
  return Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_MULTIPLIER, level - 1));
}

export function getLevelFromXp(totalXp: number): { level: number; currentXp: number; xpForNext: number } {
  let level = 1;
  let xpRemaining = totalXp;
  while (true) {
    const needed = getXpForLevel(level);
    if (xpRemaining < needed) {
      return { level, currentXp: xpRemaining, xpForNext: needed };
    }
    xpRemaining -= needed;
    level++;
  }
}

export const PRIORITY_LABELS = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
} as const;

export const PRIORITY_COLORS = {
  low: '#58CC02',
  medium: '#FF9600',
  high: '#FF4B4B',
} as const;
