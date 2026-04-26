export type HabitType = 'water' | 'movement' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description: string;
  type: HabitType;
  order: number;
  createdAt: string;

  // Water habit specifics
  waterMinOz?: number;
  waterMaxOz?: number;

  // Time/movement habit specifics
  durationMinutes?: number;

  // Custom habit goal label (e.g. "30 min walk", "1 journal page")
  goalLabel?: string;

  // How many consecutive completed days before the NEXT habit unlocks
  unlocksNextAfterDays: number;
}

export interface DayLog {
  date: string;       // YYYY-MM-DD
  habitId: string;
  completed: boolean;
  waterOz?: number;   // for water habit
  notes?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  waterReminders: string[];   // HH:MM strings e.g. ["08:00","12:00","16:00","20:00"]
  movementReminder: string;   // HH:MM
}

export interface AppData {
  habits: Habit[];
  logs: DayLog[];
  notificationSettings: NotificationSettings;
}

// Derived status for display
export type HabitStatus = 'active' | 'locked' | 'mastered';

export interface HabitWithStatus extends Habit {
  status: HabitStatus;
  streak: number;            // current consecutive completed days
  todayCompleted: boolean;
  todayWaterOz?: number;     // for water habit
  daysUntilUnlock: number;   // how many more days until next habit unlocks (0 if already did)
}
