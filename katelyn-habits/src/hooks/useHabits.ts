import { useState, useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import type { Habit, DayLog, AppData, HabitWithStatus, NotificationSettings } from '../types';
import { today, calcStreak, toDateStr } from '../utils/dates';

const WATER_HABIT_ID = 'habit-water-default';

const DEFAULT_HABITS: Habit[] = [
  {
    id: WATER_HABIT_ID,
    name: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    type: 'water',
    order: 0,
    createdAt: toDateStr(),
    waterMinOz: 80,
    waterMaxOz: 100,
    unlocksNextAfterDays: 10,
  },
  {
    id: 'habit-movement-default',
    name: 'Unstructured Movement',
    description: '15 minutes of any movement — walk, stretch, dance, whatever feels good',
    type: 'movement',
    order: 1,
    createdAt: toDateStr(),
    durationMinutes: 15,
    unlocksNextAfterDays: 14,
  },
];

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  waterReminders: ['08:00', '11:00', '14:00', '17:00', '20:00'],
  movementReminder: '18:00',
};

const STORAGE_KEY = 'katelyn-habits-v1';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    habits: DEFAULT_HABITS,
    logs: [],
    notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
  };
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useHabits() {
  const [data, setData] = useState<AppData>(loadData);

  const update = useCallback((next: AppData) => {
    saveData(next);
    setData(next);
  }, []);

  // ── Derived: which habits are active/locked/mastered ──────────────────────
  const habitsWithStatus = useMemo((): HabitWithStatus[] => {
    const sortedHabits = [...data.habits].sort((a, b) => a.order - b.order);
    const todayStr = today();

    return sortedHabits.map((habit, idx) => {
      const habitLogs = data.logs.filter(l => l.habitId === habit.id);
      const completedDates = new Set(habitLogs.filter(l => l.completed).map(l => l.date));
      const streak = calcStreak(completedDates);

      const todayLog = habitLogs.find(l => l.date === todayStr);
      const todayCompleted = todayLog?.completed ?? false;
      const todayWaterOz = habit.type === 'water' ? (todayLog?.waterOz ?? 0) : undefined;

      // Determine if this habit is unlocked
      // First habit is always active; subsequent habits need the previous to have
      // achieved the required streak
      let status: HabitWithStatus['status'] = 'active';
      if (idx > 0) {
        const prevHabit = sortedHabits[idx - 1];
        const prevLogs = data.logs.filter(l => l.habitId === prevHabit.id);
        const prevCompleted = new Set(prevLogs.filter(l => l.completed).map(l => l.date));
        const prevStreak = calcStreak(prevCompleted);

        // Count total completed days for previous habit
        const prevTotalCompleted = prevCompleted.size;

        if (prevStreak >= prevHabit.unlocksNextAfterDays || prevTotalCompleted >= prevHabit.unlocksNextAfterDays) {
          status = 'active';
        } else {
          status = 'locked';
        }
      }

      // Mark as mastered once the habit has reached its own unlock threshold
      // and the NEXT habit is active
      if (idx < sortedHabits.length - 1) {
        const nextHabit = sortedHabits[idx + 1];
        const nextIdx = sortedHabits.findIndex(h => h.id === nextHabit.id);
        if (nextIdx > 0) {
          const meCompletedDates = completedDates;
          if (calcStreak(meCompletedDates) >= habit.unlocksNextAfterDays || meCompletedDates.size >= habit.unlocksNextAfterDays) {
            status = 'mastered';
          }
        }
      }

      const daysUntilUnlock = Math.max(0, habit.unlocksNextAfterDays - streak);

      return {
        ...habit,
        status,
        streak,
        todayCompleted,
        todayWaterOz,
        daysUntilUnlock,
      };
    });
  }, [data]);

  // ── Water logging ─────────────────────────────────────────────────────────
  const logWater = useCallback((oz: number) => {
    const todayStr = today();
    const logs = [...data.logs];
    const existingIdx = logs.findIndex(l => l.habitId === WATER_HABIT_ID && l.date === todayStr);
    const waterHabit = data.habits.find(h => h.id === WATER_HABIT_ID);
    const minOz = waterHabit?.waterMinOz ?? 80;

    if (existingIdx >= 0) {
      const newOz = Math.max(0, (logs[existingIdx].waterOz ?? 0) + oz);
      logs[existingIdx] = {
        ...logs[existingIdx],
        waterOz: newOz,
        completed: newOz >= minOz,
      };
    } else {
      const newOz = Math.max(0, oz);
      logs.push({
        date: todayStr,
        habitId: WATER_HABIT_ID,
        waterOz: newOz,
        completed: newOz >= minOz,
      });
    }

    update({ ...data, logs });
  }, [data, update]);

  const setWaterOz = useCallback((oz: number) => {
    const todayStr = today();
    const logs = [...data.logs];
    const existingIdx = logs.findIndex(l => l.habitId === WATER_HABIT_ID && l.date === todayStr);
    const waterHabit = data.habits.find(h => h.id === WATER_HABIT_ID);
    const minOz = waterHabit?.waterMinOz ?? 80;
    const newOz = Math.max(0, oz);

    if (existingIdx >= 0) {
      logs[existingIdx] = { ...logs[existingIdx], waterOz: newOz, completed: newOz >= minOz };
    } else {
      logs.push({ date: todayStr, habitId: WATER_HABIT_ID, waterOz: newOz, completed: newOz >= minOz });
    }

    update({ ...data, logs });
  }, [data, update]);

  // ── General habit completion toggle ──────────────────────────────────────
  const toggleHabitComplete = useCallback((habitId: string) => {
    const todayStr = today();
    const logs = [...data.logs];
    const existingIdx = logs.findIndex(l => l.habitId === habitId && l.date === todayStr);

    if (existingIdx >= 0) {
      logs[existingIdx] = { ...logs[existingIdx], completed: !logs[existingIdx].completed };
    } else {
      logs.push({ date: todayStr, habitId, completed: true });
    }

    update({ ...data, logs });
  }, [data, update]);

  // ── Add a new habit to the end of the chain ───────────────────────────────
  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'order'>) => {
    const maxOrder = data.habits.reduce((m, h) => Math.max(m, h.order), -1);
    const newHabit: Habit = {
      ...habitData,
      id: uuid(),
      createdAt: toDateStr(),
      order: maxOrder + 1,
    };
    update({ ...data, habits: [...data.habits, newHabit] });
  }, [data, update]);

  // ── Update notification settings ──────────────────────────────────────────
  const updateNotificationSettings = useCallback((settings: Partial<NotificationSettings>) => {
    update({ ...data, notificationSettings: { ...data.notificationSettings, ...settings } });
  }, [data, update]);

  // ── History for a specific habit ──────────────────────────────────────────
  const getHabitLogs = useCallback((habitId: string): DayLog[] => {
    return data.logs.filter(l => l.habitId === habitId);
  }, [data.logs]);

  return {
    habits: habitsWithStatus,
    notificationSettings: data.notificationSettings,
    logWater,
    setWaterOz,
    toggleHabitComplete,
    addHabit,
    updateNotificationSettings,
    getHabitLogs,
  };
}
