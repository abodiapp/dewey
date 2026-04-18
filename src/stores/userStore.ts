import { create } from 'zustand';
import type { UserProfile, DayRecord } from '../types';
import { getItem, setItem } from '../utils/storage';
import { todayStr } from '../utils/helpers';
import { getLevelFromXp, XP_VALUES } from '../utils/constants';
import { differenceInCalendarDays, parseISO } from 'date-fns';

const defaultProfile: UserProfile = {
  name: 'Explorer',
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  joinedDate: todayStr(),
  tasksCompletedTotal: 0,
  dayRecords: {},
};

interface UserState {
  profile: UserProfile;
  showLevelUp: boolean;
  lastXpGain: number;
  setShowLevelUp: (v: boolean) => void;
  addXp: (amount: number) => void;
  removeXp: (amount: number) => void;
  recordTaskCompletion: (allCompleted: boolean) => void;
  recordTaskUndo: () => void;
  updateStreak: () => void;
  updateName: (name: string) => void;
  getLevelInfo: () => { level: number; currentXp: number; xpForNext: number };
  getTodayRecord: () => DayRecord;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: getItem<UserProfile>('profile', defaultProfile),
  showLevelUp: false,
  lastXpGain: 0,

  setShowLevelUp: (v) => set({ showLevelUp: v }),

  addXp: (amount) => {
    const { profile } = get();
    const oldLevel = getLevelFromXp(profile.xp).level;
    const newXp = profile.xp + amount;
    const newLevel = getLevelFromXp(newXp).level;
    const updated = { ...profile, xp: newXp, level: newLevel };
    set({ profile: updated, lastXpGain: amount, showLevelUp: newLevel > oldLevel });
    setItem('profile', updated);
  },

  removeXp: (amount) => {
    const { profile } = get();
    const newXp = Math.max(0, profile.xp + amount); // amount is negative
    const newLevel = getLevelFromXp(newXp).level;
    const updated = { ...profile, xp: newXp, level: newLevel };
    set({ profile: updated });
    setItem('profile', updated);
  },

  recordTaskCompletion: (allCompleted) => {
    const { profile } = get();
    const today = todayStr();
    const dayRecord = profile.dayRecords[today] || { date: today, tasksCompleted: 0, tasksTotal: 0, xpEarned: 0 };
    dayRecord.tasksCompleted += 1;
    const updated = {
      ...profile,
      tasksCompletedTotal: profile.tasksCompletedTotal + 1,
      dayRecords: { ...profile.dayRecords, [today]: dayRecord },
    };
    set({ profile: updated });
    setItem('profile', updated);

    if (allCompleted) {
      get().addXp(XP_VALUES.allDayBonus);
    }
  },

  recordTaskUndo: () => {
    const { profile } = get();
    const today = todayStr();
    const dayRecord = profile.dayRecords[today];
    if (dayRecord && dayRecord.tasksCompleted > 0) {
      dayRecord.tasksCompleted -= 1;
      const updated = {
        ...profile,
        tasksCompletedTotal: Math.max(0, profile.tasksCompletedTotal - 1),
        dayRecords: { ...profile.dayRecords, [today]: dayRecord },
      };
      set({ profile: updated });
      setItem('profile', updated);
    }
  },

  updateStreak: () => {
    const { profile } = get();
    const today = todayStr();
    if (profile.lastActiveDate === today) return;

    let newStreak = profile.streak;
    if (profile.lastActiveDate) {
      const diff = differenceInCalendarDays(parseISO(today), parseISO(profile.lastActiveDate));
      if (diff === 1) {
        newStreak += 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const updated = {
      ...profile,
      streak: newStreak,
      longestStreak: Math.max(newStreak, profile.longestStreak),
      lastActiveDate: today,
    };
    set({ profile: updated });
    setItem('profile', updated);
  },

  updateName: (name) => {
    const { profile } = get();
    const updated = { ...profile, name };
    set({ profile: updated });
    setItem('profile', updated);
  },

  getLevelInfo: () => getLevelFromXp(get().profile.xp),

  getTodayRecord: () => {
    const today = todayStr();
    return get().profile.dayRecords[today] || { date: today, tasksCompleted: 0, tasksTotal: 0, xpEarned: 0 };
  },
}));
