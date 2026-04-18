import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'xp';
  xpAmount?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString(36);
    set({ toasts: [...get().toasts, { ...toast, id }] });
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
}));

const icons = {
  success: <CheckCircle size={20} className="text-primary" />,
  warning: <AlertTriangle size={20} className="text-accent-orange" />,
  info: <Info size={20} className="text-secondary" />,
  xp: <span className="text-xp-bar font-black text-sm">XP</span>,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="bg-bg-card border-2 border-border rounded-2xl p-4 flex items-center gap-3 shadow-xl"
          >
            {icons[toast.type]}
            <span className="flex-1 text-sm font-semibold">
              {toast.message}
              {toast.type === 'xp' && toast.xpAmount && (
                <span className="text-xp-bar ml-1">+{toast.xpAmount} XP</span>
              )}
            </span>
            <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-primary cursor-pointer">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
