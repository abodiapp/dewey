import { motion } from 'framer-motion';
import { Check, Trash2, Clock, Tag } from 'lucide-react';
import type { Task } from '../../types';
import { useTaskStore } from '../../stores/taskStore';
import { useUserStore } from '../../stores/userStore';
import { useToastStore } from '../ui/Toast';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../utils/constants';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const toggleTask = useTaskStore(s => s.toggleTask);
  const deleteTask = useTaskStore(s => s.deleteTask);
  const addXp = useUserStore(s => s.addXp);
  const removeXp = useUserStore(s => s.removeXp);
  const recordTaskCompletion = useUserStore(s => s.recordTaskCompletion);
  const recordTaskUndo = useUserStore(s => s.recordTaskUndo);
  const categories = useTaskStore(s => s.categories);
  const addToast = useToastStore(s => s.addToast);

  const category = categories.find(c => c.id === task.categoryId);

  const handleToggle = () => {
    const { xpDelta, allCompleted } = toggleTask(task.id);
    if (xpDelta > 0) {
      addXp(xpDelta);
      recordTaskCompletion(allCompleted);
      addToast({ message: `¡Tarea completada!`, type: 'xp', xpAmount: xpDelta });

      if (allCompleted) {
        setTimeout(() => {
          confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 }, colors: ['#58CC02', '#FFD900', '#1CB0F6'] });
          addToast({ message: '¡Todas las tareas del día completadas! +50 XP bonus', type: 'success' });
        }, 500);
      }
    } else {
      removeXp(xpDelta);
      recordTaskUndo();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={`group bg-bg-card border-2 rounded-2xl p-4 flex items-start gap-3 transition-all ${
        task.completed
          ? 'border-primary/20 opacity-60'
          : 'border-border hover:border-text-muted/30'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
          task.completed
            ? 'bg-primary border-primary'
            : 'border-text-muted hover:border-primary'
        }`}
      >
        {task.completed && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
            <Check size={16} className="text-white" strokeWidth={3} />
          </motion.div>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-[15px] leading-snug ${task.completed ? 'line-through text-text-muted' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-text-muted mt-1 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {category && (
            <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: category.color }}>
              <Tag size={10} />
              {category.name}
            </span>
          )}
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
            style={{ color: PRIORITY_COLORS[task.priority], backgroundColor: PRIORITY_COLORS[task.priority] + '20' }}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          {task.dueTime && (
            <span className="flex items-center gap-1 text-[11px] text-text-muted font-semibold">
              <Clock size={10} />
              {task.dueTime}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-accent-red/20 text-text-muted hover:text-accent-red transition-all cursor-pointer"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
