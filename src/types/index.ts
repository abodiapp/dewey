export type Priority = 'low' | 'medium' | 'high';

export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: CategoryId;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  dueTime?: string;
  completedAt?: string;
  xpAwarded: number;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  tasksTotal: number;
  xpEarned: number;
}

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  joinedDate: string;
  tasksCompletedTotal: number;
  dayRecords: Record<string, DayRecord>;
}

export interface Notification {
  id: string;
  taskId: string;
  message: string;
  time: string;
  enabled: boolean;
}
