import { useCallback, useEffect } from 'react';

export function useNotifications() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const notify = useCallback((title: string, body?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/dewey-icon.png',
        badge: '/dewey-icon.png',
      });
    }
  }, []);

  const scheduleReminder = useCallback((title: string, body: string, delayMs: number) => {
    const timer = setTimeout(() => {
      notify(title, body);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [notify]);

  return { notify, scheduleReminder };
}
