import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { Star, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function LevelUpModal() {
  const show = useUserStore(s => s.showLevelUp);
  const setShow = useUserStore(s => s.setShowLevelUp);
  const level = useUserStore(s => s.profile.level);

  useEffect(() => {
    if (show) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58CC02', '#FFD900', '#1CB0F6', '#CE82FF', '#FF9600'],
      });
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-bg-card border-2 border-primary/30 rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-4"
              >
                <Star size={40} className="text-xp-bar" fill="#FFD900" />
              </motion.div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles size={20} className="text-xp-bar" />
                <h2 className="text-2xl font-black text-xp-bar">NIVEL {level}</h2>
                <Sparkles size={20} className="text-xp-bar" />
              </div>
              <p className="text-text-secondary mb-6 font-medium">
                {level <= 3 ? '¡Vas muy bien! Sigue así.' :
                 level <= 7 ? '¡Impresionante disciplina!' :
                 level <= 15 ? '¡Eres imparable!' : '¡Leyenda de la productividad!'}
              </p>
              <Button onClick={() => setShow(false)} size="lg" className="w-full">
                ¡Continuar!
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
