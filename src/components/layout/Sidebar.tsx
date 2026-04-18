import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, BarChart3, User, Flame } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Hoy' },
  { to: '/categories', icon: FolderOpen, label: 'Categorías' },
  { to: '/stats', icon: BarChart3, label: 'Estadísticas' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export default function Sidebar() {
  const location = useLocation();
  const profile = useUserStore(s => s.profile);
  const levelInfo = useUserStore(s => s.getLevelInfo)();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] bg-bg-card border-r-2 border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-[0_3px_0_0_#46a302]">
            <span className="text-2xl font-black text-white">D</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-primary tracking-tight">Dewey</h1>
            <p className="text-xs text-text-muted font-semibold">Tu día, gamificado</p>
          </div>
        </div>
      </div>

      {/* Streak + Level mini card */}
      <div className="p-4">
        <div className="bg-bg-elevated rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-streak" />
              <span className="font-bold text-streak">{profile.streak}</span>
            </div>
            <span className="text-xs font-bold text-text-muted">Nivel {levelInfo.level}</span>
          </div>
          <div className="w-full bg-bg rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="h-full bg-xp-bar rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(levelInfo.currentXp / levelInfo.xpForNext) * 100}%` }}
              transition={{ type: 'spring', damping: 15 }}
            />
          </div>
          <p className="text-xs text-text-muted text-center font-semibold">
            {levelInfo.currentXp} / {levelInfo.xpForNext} XP
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-150 ${
                active
                  ? 'bg-secondary/15 text-secondary border-2 border-secondary/30'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary border-2 border-transparent'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-text-muted text-center font-medium">Dewey v1.0</p>
      </div>
    </aside>
  );
}
