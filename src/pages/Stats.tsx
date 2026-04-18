import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TrendingUp, Calendar, CheckCircle2, Zap, Award } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useTaskStore } from '../stores/taskStore';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { todayStr } from '../utils/helpers';

export default function Stats() {
  const profile = useUserStore(s => s.profile);
  const tasks = useTaskStore(s => s.tasks);

  const weekData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(t => t.createdAt.startsWith(dateStr) || t.dueDate === dateStr);
      const completed = dayTasks.filter(t => t.completed).length;
      return {
        day: format(date, 'EEE', { locale: es }),
        date: dateStr,
        completed,
        total: dayTasks.length,
        isToday: dateStr === todayStr(),
      };
    });
  }, [tasks]);

  const categoryStats = useMemo(() => {
    const cats = useTaskStore.getState().categories;
    return cats.map(cat => {
      const catTasks = tasks.filter(t => t.categoryId === cat.id);
      const done = catTasks.filter(t => t.completed).length;
      return {
        name: cat.name,
        color: cat.color,
        total: catTasks.length,
        done,
        pct: catTasks.length > 0 ? Math.round((done / catTasks.length) * 100) : 0,
      };
    }).filter(c => c.total > 0);
  }, [tasks]);

  const totalCompleted = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Heatmap last 28 days
  const heatmapData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 28 }, (_, i) => {
      const date = subDays(today, 27 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(t => t.createdAt.startsWith(dateStr) || t.dueDate === dateStr);
      const completed = dayTasks.filter(t => t.completed).length;
      const total = dayTasks.length;
      return { date: dateStr, completed, total, intensity: total > 0 ? completed / total : 0, day: format(date, 'd') };
    });
  }, [tasks]);

  const statCards = [
    { label: 'XP Total', value: profile.xp, icon: Zap, color: '#FFD900' },
    { label: 'Nivel', value: profile.level, icon: Award, color: '#CE82FF' },
    { label: 'Completadas', value: totalCompleted, icon: CheckCircle2, color: '#58CC02' },
    { label: 'Tasa', value: `${completionRate}%`, icon: TrendingUp, color: '#1CB0F6' },
  ];

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      <h1 className="text-2xl font-black">Estadísticas</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-bg-card border-2 border-border rounded-2xl p-4"
          >
            <stat.icon size={20} style={{ color: stat.color }} />
            <p className="text-2xl font-black mt-2" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-text-muted font-bold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="bg-bg-card border-2 border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-secondary" />
          <h2 className="font-bold text-sm">Tareas completadas - Últimos 7 días</h2>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#5C7A85', fontSize: 12, fontWeight: 600 }} />
            <YAxis hide allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A2D35', border: '2px solid #2A4350', borderRadius: 12, fontSize: 12, fontWeight: 600 }}
              cursor={{ fill: 'rgba(88, 204, 2, 0.1)' }}
            />
            <Bar dataKey="completed" radius={[8, 8, 0, 0]} maxBarSize={36}>
              {weekData.map((entry, index) => (
                <Cell key={index} fill={entry.isToday ? '#58CC02' : '#233A44'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="bg-bg-card border-2 border-border rounded-2xl p-5">
        <h2 className="font-bold text-sm mb-4">Actividad - Últimos 28 días</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {heatmapData.map(d => (
            <div
              key={d.date}
              className="aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold"
              title={`${d.date}: ${d.completed}/${d.total}`}
              style={{
                backgroundColor: d.total === 0
                  ? '#233A44'
                  : `rgba(88, 204, 2, ${0.2 + d.intensity * 0.8})`,
                color: d.intensity > 0.5 ? '#fff' : '#5C7A85',
              }}
            >
              {d.day}
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryStats.length > 0 && (
        <div className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-sm">Por categoría</h2>
          {categoryStats.map(cat => (
            <div key={cat.name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-bold" style={{ color: cat.color }}>{cat.name}</span>
                <span className="text-text-muted font-semibold">{cat.done}/{cat.total} ({cat.pct}%)</span>
              </div>
              <div className="w-full bg-bg rounded-full h-2.5 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ backgroundColor: cat.color, width: `${cat.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
