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

async function sendViaServiceWorker(title: string, body: string, icon = '/icon-192.svg') {
  if (!('serviceWorker' in navigator)) return false;
  const reg = await navigator.serviceWorker.ready;
  // Use showNotification on the registration for background-safe delivery
  await reg.showNotification(title, { body, icon, badge: icon });
  return true;
}

function sendFallbackNotification(title: string, body: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  new Notification(title, { body });
}

async function notify(title: string, body: string, icon?: string) {
  const sent = await sendViaServiceWorker(title, body, icon).catch(() => false);
  if (!sent) sendFallbackNotification(title, body);
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

  useEffect(() => {
    if (!settings.enabled) return;

    const check = () => {
      const now = currentMinutes();

      if (waterTodayOz < waterMinOz) {
        for (const t of settings.waterReminders) {
          if (timeToMinutes(t) === now) {
            const remaining = waterMinOz - waterTodayOz;
            notify(
              '💧 Hydration Check',
              `${waterTodayOz} oz logged — drink ${remaining} more oz to hit your goal!`,
            );
            break;
          }
        }
      }

      if (!movementDone && timeToMinutes(settings.movementReminder) === now) {
        notify(
          '🏃 Time to Move!',
          'Just 15 minutes of any movement counts. Walk, stretch, dance — you\'ve got this.',
        );
      }
    };

    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [settings, waterTodayOz, waterMinOz, movementDone]);

  return { requestPermission };
}
