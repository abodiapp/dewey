import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, BarChart3, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Hoy' },
  { to: '/categories', icon: FolderOpen, label: 'Categorías' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-card border-t-2 border-border z-30 safe-area-bottom">
      <div className="flex justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
                active ? 'text-secondary' : 'text-text-muted'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
