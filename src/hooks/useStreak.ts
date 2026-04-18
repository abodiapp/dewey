import { useEffect } from 'react';
import { useUserStore } from '../stores/userStore';

export function useStreak() {
  const updateStreak = useUserStore(s => s.updateStreak);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);
}
