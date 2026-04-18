import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import ToastContainer from './components/ui/Toast';
import LevelUpModal from './components/gamification/LevelUpModal';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import { useStreak } from './hooks/useStreak';
import { useNotifications } from './hooks/useNotifications';
import { useEffect } from 'react';
import { useTaskStore } from './stores/taskStore';
import { todayStr } from './utils/helpers';

function AppContent() {
  useStreak();
  const { notify } = useNotifications();
  const tasks = useTaskStore(s => s.tasks);

  // Evening reminder
  useEffect(() => {
    const checkEvening = () => {
      const h = new Date().getHours();
      if (h === 20) {
        const today = todayStr();
        const pending = tasks.filter(t => (t.dueDate === today || t.createdAt.startsWith(today)) && !t.completed);
        if (pending.length > 0) {
          notify('Dewey - Recordatorio', `Tienes ${pending.length} tarea(s) pendiente(s) hoy. ¡No pierdas tu racha!`);
        }
      }
    };
    const interval = setInterval(checkEvening, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, notify]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-8 max-w-2xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
      <BottomNav />
      <ToastContainer />
      <LevelUpModal />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
