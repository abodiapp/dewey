import { useState, useMemo } from 'react';
import { Plus, ListChecks, Sparkles, Target } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';
import StreakBanner from '../components/gamification/StreakBanner';
import XPBar from '../components/gamification/XPBar';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { todayStr } from '../utils/helpers';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const tasks = useTaskStore(s => s.tasks);
  const profile = useUserStore(s => s.profile);

  const todayTasks = useMemo(() => {
    const today = todayStr();
    return tasks.filter(t => t.createdAt.startsWith(today) || t.dueDate === today);
  }, [tasks]);

  const completedCount = todayTasks.filter(t => t.completed).length;
  const totalCount = todayTasks.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingTasks = todayTasks.filter(t => !t.completed);
  const doneTasks = todayTasks.filter(t => t.completed);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-black">
          {greeting}, {profile.name} <span className="inline-block animate-bounce-in">👋</span>
        </h1>
        <p className="text-text-muted font-semibold capitalize">
          {format(now, "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Streak */}
      <StreakBanner />

      {/* XP Bar */}
      <XPBar />

      {/* Day Progress */}
      {totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-bg-card border-2 border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-secondary" />
              <span className="font-bold text-sm">Progreso del día</span>
            </div>
            <span className="text-sm font-black text-primary">{pct}%</span>
          </div>
          <div className="w-full bg-bg rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', damping: 15 }}
            />
          </div>
          <p className="text-xs text-text-muted mt-2 font-semibold">
            {completedCount} de {totalCount} tareas completadas
          </p>
        </motion.div>
      )}

      {/* Add Task Button */}
      <Button onClick={() => setShowForm(true)} size="lg" className="w-full" icon={<Plus size={22} />}>
        Nueva tarea
      </Button>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListChecks size={18} className="text-secondary" />
            <h2 className="font-bold text-sm text-text-secondary">Pendientes ({pendingTasks.length})</h2>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {pendingTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {doneTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-primary" />
            <h2 className="font-bold text-sm text-text-secondary">Completadas ({doneTasks.length})</h2>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {doneTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-black mb-2">¡Empieza tu día!</h3>
          <p className="text-text-muted font-medium max-w-xs mx-auto">
            Agrega tus tareas y gana XP al completarlas. ¡Mantén tu racha!
          </p>
        </motion.div>
      )}

      {/* Modal Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Nueva tarea">
        <TaskForm onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}
