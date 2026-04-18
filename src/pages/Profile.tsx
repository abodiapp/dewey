import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Flame, Trophy, Star, Zap, Calendar, CheckCircle2, Edit3, Save } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import XPBar from '../components/gamification/XPBar';
import Button from '../components/ui/Button';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Profile() {
  const profile = useUserStore(s => s.profile);
  const updateName = useUserStore(s => s.updateName);
  const levelInfo = useUserStore(s => s.getLevelInfo)();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);

  const handleSaveName = () => {
    if (name.trim()) {
      updateName(name.trim());
      setEditing(false);
    }
  };

  const levelTitles = ['Novato', 'Aprendiz', 'Iniciado', 'Constante', 'Disciplinado', 'Enfocado', 'Dedicado', 'Experto', 'Maestro', 'Leyenda'];
  const titleIndex = Math.min(Math.floor((levelInfo.level - 1) / 2), levelTitles.length - 1);

  const stats = [
    { icon: Zap, label: 'XP Total', value: profile.xp, color: '#FFD900' },
    { icon: Star, label: 'Nivel', value: levelInfo.level, color: '#CE82FF' },
    { icon: Flame, label: 'Racha actual', value: `${profile.streak} días`, color: '#FF9600' },
    { icon: Trophy, label: 'Mejor racha', value: `${profile.longestStreak} días`, color: '#1CB0F6' },
    { icon: CheckCircle2, label: 'Tareas completadas', value: profile.tasksCompletedTotal, color: '#58CC02' },
    { icon: Calendar, label: 'Miembro desde', value: profile.joinedDate ? format(parseISO(profile.joinedDate), "d MMM yyyy", { locale: es }) : 'Hoy', color: '#A0B4BC' },
  ];

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      <h1 className="text-2xl font-black">Perfil</h1>

      {/* Avatar + Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card border-2 border-border rounded-2xl p-6 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <User size={36} className="text-white" />
        </div>

        {editing ? (
          <div className="flex items-center justify-center gap-2 mt-2">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-bg-elevated border-2 border-border rounded-xl px-3 py-2 text-center font-bold focus:outline-none focus:border-primary"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
            />
            <button onClick={handleSaveName} className="p-2 rounded-xl bg-primary text-white cursor-pointer">
              <Save size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-black">{profile.name}</h2>
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer">
              <Edit3 size={14} />
            </button>
          </div>
        )}

        <p className="text-sm font-bold mt-1" style={{ color: '#CE82FF' }}>
          {levelTitles[titleIndex]}
        </p>
      </motion.div>

      {/* XP Bar */}
      <div className="bg-bg-card border-2 border-border rounded-2xl p-5">
        <XPBar />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-bg-card border-2 border-border rounded-2xl p-4"
          >
            <stat.icon size={20} style={{ color: stat.color }} />
            <p className="text-lg font-black mt-2">{stat.value}</p>
            <p className="text-xs text-text-muted font-bold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Reset (dev) */}
      <div className="pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-text-muted"
          onClick={() => {
            if (confirm('¿Borrar todos los datos? Esta acción no se puede deshacer.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        >
          Reiniciar todos los datos
        </Button>
      </div>
    </div>
  );
}
