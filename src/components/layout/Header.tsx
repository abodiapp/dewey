import { Flame } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { motion } from 'framer-motion';

export default function Header() {
  const profile = useUserStore(s => s.profile);
  const levelInfo = useUserStore(s => s.getLevelInfo)();

  return (
    <header className="lg:hidden sticky top-0 z-20 bg-bg-card/90 backdrop-blur-md border-b-2 border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-[0_2px_0_0_#46a302]">
            <span className="text-lg font-black text-white">D</span>
          </div>
          <span className="text-lg font-black text-primary">Dewey</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-1.5">
            <Flame size={18} className="text-streak" />
            <span className="text-sm font-bold text-streak">{profile.streak}</span>
          </div>

          {/* Level + XP */}
          <div className="flex items-center gap-2">
            <div className="w-20 bg-bg rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-xp-bar rounded-full"
                animate={{ width: `${(levelInfo.currentXp / levelInfo.xpForNext) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-xp-bar">Nv.{levelInfo.level}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
