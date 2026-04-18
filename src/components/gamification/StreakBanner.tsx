import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';

export default function StreakBanner() {
  const { streak, longestStreak } = useUserStore(s => s.profile);

  if (streak === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-accent-orange/20 to-accent-red/10 border-2 border-accent-orange/30 rounded-2xl p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame size={32} className="text-streak" fill="#FF9600" />
        </motion.div>
        <div>
          <p className="font-black text-lg text-streak">{streak} {streak === 1 ? 'día' : 'días'} de racha</p>
          <p className="text-xs text-text-muted font-semibold">¡No pierdas el impulso!</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-text-muted">
        <Trophy size={14} />
        <span className="text-xs font-bold">Mejor: {longestStreak}</span>
      </div>
    </motion.div>
  );
}
