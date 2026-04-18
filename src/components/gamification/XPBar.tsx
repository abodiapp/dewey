import { motion } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';

export default function XPBar() {
  const levelInfo = useUserStore(s => s.getLevelInfo)();
  const totalXp = useUserStore(s => s.profile.xp);
  const pct = Math.min((levelInfo.currentXp / levelInfo.xpForNext) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-text-secondary">Nivel {levelInfo.level}</span>
        <span className="text-xs font-bold text-xp-bar">{totalXp} XP total</span>
      </div>
      <div className="w-full bg-bg rounded-full h-4 overflow-hidden border border-border">
        <motion.div
          className="h-full bg-gradient-to-r from-xp-bar to-accent-orange rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full" style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)'
          }} />
        </motion.div>
      </div>
      <p className="text-xs text-text-muted text-right font-semibold">
        {levelInfo.currentXp} / {levelInfo.xpForNext} XP para Nivel {levelInfo.level + 1}
      </p>
    </div>
  );
}
