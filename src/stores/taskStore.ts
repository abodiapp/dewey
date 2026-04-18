import { create } from 'zustand';
import type { Task, Category } from '../types';
import { getItem, setItem } from '../utils/storage';
import { DEFAULT_CATEGORIES, XP_VALUES } from '../utils/constants';
import { todayStr, generateId } from '../utils/helpers';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt' | 'xpAwarded'>) => Task;
  toggleTask: (id: string) => { xpDelta: number; allCompleted: boolean };
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addCategory: (name: string, icon: string, color: string) => void;
  deleteCategory: (id: string) => void;
  getTodayTasks: () => Task[];
  getTasksByCategory: (categoryId: string) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: getItem<Task[]>('tasks', []),
  categories: getItem<Category[]>('categories', DEFAULT_CATEGORIES),

  addTask: (taskData) => {
    const task: Task = {
      ...taskData,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
      xpAwarded: 0,
    };
    const newTasks = [...get().tasks, task];
    set({ tasks: newTasks });
    setItem('tasks', newTasks);
    return task;
  },

  toggleTask: (id) => {
    const tasks = get().tasks;
    const task = tasks.find(t => t.id === id);
    if (!task) return { xpDelta: 0, allCompleted: false };

    const completing = !task.completed;
    const xpDelta = completing ? XP_VALUES[task.priority] : -task.xpAwarded;

    const newTasks = tasks.map(t =>
      t.id === id
        ? {
            ...t,
            completed: completing,
            completedAt: completing ? new Date().toISOString() : undefined,
            xpAwarded: completing ? XP_VALUES[task.priority] : 0,
          }
        : t
    );
    set({ tasks: newTasks });
    setItem('tasks', newTasks);

    const today = todayStr();
    const todayTasks = newTasks.filter(t => t.createdAt.startsWith(today) || t.dueDate === today);
    const allCompleted = todayTasks.length > 0 && todayTasks.every(t => t.completed);

    return { xpDelta, allCompleted };
  },

  deleteTask: (id) => {
    const newTasks = get().tasks.filter(t => t.id !== id);
    set({ tasks: newTasks });
    setItem('tasks', newTasks);
  },

  updateTask: (id, updates) => {
    const newTasks = get().tasks.map(t => (t.id === id ? { ...t, ...updates } : t));
    set({ tasks: newTasks });
    setItem('tasks', newTasks);
  },

  addCategory: (name, icon, color) => {
    const cat: Category = { id: generateId(), name, icon, color, isCustom: true };
    const newCats = [...get().categories, cat];
    set({ categories: newCats });
    setItem('categories', newCats);
  },

  deleteCategory: (id) => {
    const newCats = get().categories.filter(c => c.id !== id);
    set({ categories: newCats });
    setItem('categories', newCats);
  },

  getTodayTasks: () => {
    const today = todayStr();
    return get().tasks.filter(t => t.createdAt.startsWith(today) || t.dueDate === today);
  },

  getTasksByCategory: (categoryId) => {
    return get().tasks.filter(t => t.categoryId === categoryId);
  },
}));
