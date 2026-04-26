import { useEffect, useCallback } from 'react';
import type { NotificationSettings } from '../types';

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function useNotifications(
  settings: NotificationSettings,
  waterTodayOz: number,
  waterMinOz: number,
  movementDone: boolean,
) {
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }, []);

  const sendNotification = useCallback((title: string, body: string, icon = '💧') => {
    if (Notification.permission !== 'granted') return;
    new Notification(`${icon} ${title}`, { body, silent: false });
  }, []);

  // Check every minute whether we should fire a reminder
  useEffect(() => {
    if (!settings.enabled) return;

    const check = () => {
      const now = currentMinutes();

      // Water reminders — only fire if goal not yet met
      if (waterTodayOz < waterMinOz) {
        for (const t of settings.waterReminders) {
          if (timeToMinutes(t) === now) {
            const remaining = waterMinOz - waterTodayOz;
            sendNotification(
              'Hydration Check',
              `You've had ${waterTodayOz} oz so far. Drink ${remaining} more oz to hit your goal!`,
              '💧',
            );
            break;
          }
        }
      }

      // Movement reminder — only if not done yet
      if (!movementDone && timeToMinutes(settings.movementReminder) === now) {
        sendNotification(
          'Time to Move!',
          'Just 15 minutes of any movement counts. Walk, stretch, dance — whatever feels good.',
          '🏃',
        );
      }
    };

    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [settings, waterTodayOz, waterMinOz, movementDone, sendNotification]);

  return { requestPermission, sendNotification };
}
