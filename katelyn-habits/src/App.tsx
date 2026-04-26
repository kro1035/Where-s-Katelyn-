import { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import { useNotifications } from './hooks/useNotifications';
import { WaterTracker } from './components/WaterTracker';
import { MovementTracker } from './components/MovementTracker';
import { CustomHabitTracker } from './components/CustomHabitTracker';
import { HabitChain } from './components/HabitChain';
import { AddHabitModal } from './components/AddHabitModal';
import { NotificationSettings } from './components/NotificationSettings';
import { StreakBadge } from './components/StreakBadge';
import type { Habit, HabitWithStatus } from './types';

export default function App() {
  const {
    habits,
    notificationSettings,
    logWater,
    setWaterOz,
    toggleHabitComplete,
    addHabit,
    updateNotificationSettings,
    getHabitLogs,
  } = useHabits();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'chain'>('today');

  const activeHabits = habits.filter(h => h.status === 'active');
  const waterHabit = habits.find(h => h.type === 'water');
  const waterOz = waterHabit?.todayWaterOz ?? 0;
  const waterMin = waterHabit?.waterMinOz ?? 80;
  const movementHabit = habits.find(h => h.type === 'movement' && h.status === 'active');
  const movementDone = movementHabit?.todayCompleted ?? false;

  const { requestPermission } = useNotifications(
    notificationSettings,
    waterOz,
    waterMin,
    movementDone,
  );

  const lastHabit = habits[habits.length - 1];
  const totalStreakDays = habits.reduce((sum, h) => sum + (h.status !== 'locked' ? h.streak : 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Katelyn's Habits</h1>
            <p className="text-xs text-gray-400">One habit at a time 🌱</p>
          </div>
          {totalStreakDays > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-orange-500 font-medium">
              <span>🔥</span>
              <span>{totalStreakDays} days</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-lg mx-auto px-4 pb-2 flex gap-1">
          {([
            { id: 'today', label: "Today's Habits" },
            { id: 'chain', label: 'Habit Chain' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {activeTab === 'today' ? (
          <>
            <TodaySummary habits={habits} />

            {activeHabits.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🌱</p>
                <p className="font-medium">No active habits yet</p>
              </div>
            )}

            {activeHabits.map(habit => {
              const logs = getHabitLogs(habit.id);

              if (habit.type === 'water') {
                return (
                  <div key={habit.id} className="space-y-3">
                    <WaterTracker
                      habit={habit}
                      logs={logs}
                      onLogWater={logWater}
                      onSetWater={setWaterOz}
                    />
                    <StreakBadge streak={habit.streak} target={habit.unlocksNextAfterDays} />
                  </div>
                );
              }

              if (habit.type === 'movement') {
                return (
                  <div key={habit.id} className="space-y-3">
                    <MovementTracker
                      habit={habit}
                      logs={logs}
                      onToggle={() => toggleHabitComplete(habit.id)}
                    />
                    <StreakBadge streak={habit.streak} target={habit.unlocksNextAfterDays} />
                  </div>
                );
              }

              return (
                <div key={habit.id} className="space-y-3">
                  <CustomHabitTracker
                    habit={habit}
                    logs={logs}
                    onToggle={() => toggleHabitComplete(habit.id)}
                  />
                  <StreakBadge streak={habit.streak} target={habit.unlocksNextAfterDays} />
                </div>
              );
            })}

            <LockedPreview habits={habits} onAddHabit={() => setAddModalOpen(true)} />

            <NotificationSettings
              settings={notificationSettings}
              onChange={updateNotificationSettings}
              onRequestPermission={requestPermission}
            />
          </>
        ) : (
          <HabitChain habits={habits} onAddHabit={() => setAddModalOpen(true)} />
        )}
      </main>

      {addModalOpen && (
        <AddHabitModal
          prevHabitName={lastHabit?.name ?? 'your current habit'}
          onAdd={(data: Omit<Habit, 'id' | 'createdAt' | 'order'>) => {
            addHabit(data);
            setAddModalOpen(false);
          }}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </div>
  );
}

function TodaySummary({ habits }: { habits: HabitWithStatus[] }) {
  const active = habits.filter(h => h.status === 'active');
  const done = active.filter(h => h.todayCompleted).length;
  if (active.length === 0) return null;
  const allDone = done === active.length;

  return (
    <div className={`rounded-xl px-5 py-4 border flex items-center justify-between ${
      allDone ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'
    }`}>
      <div>
        <p className={`text-sm font-semibold ${allDone ? 'text-green-700' : 'text-blue-700'}`}>
          {allDone ? '🎉 All habits done today!' : `${done} of ${active.length} habits done`}
        </p>
        <p className={`text-xs mt-0.5 ${allDone ? 'text-green-500' : 'text-blue-400'}`}>
          {allDone ? "You're crushing it. Keep the streak alive!" : "Keep going — you've got this!"}
        </p>
      </div>
      <div className="flex gap-1">
        {active.map(h => (
          <div
            key={h.id}
            className={`w-3 h-3 rounded-full ${h.todayCompleted ? 'bg-green-400' : 'bg-gray-200'}`}
            title={h.name}
          />
        ))}
      </div>
    </div>
  );
}

function LockedPreview({ habits, onAddHabit }: { habits: HabitWithStatus[]; onAddHabit: () => void }) {
  const nextLocked = habits.find(h => h.status === 'locked');
  const lastActive = [...habits].filter(h => h.status === 'active').at(-1);

  if (!nextLocked && lastActive) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 px-5 py-4 text-center">
        <p className="text-sm text-gray-400 mb-2">What habit do you want to build next?</p>
        <button
          onClick={onAddHabit}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium"
        >
          + Plan your next habit →
        </button>
      </div>
    );
  }

  if (!nextLocked) return null;

  const daysLeft = lastActive?.daysUntilUnlock ?? 0;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 px-5 py-4 opacity-80">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔒</span>
        <div>
          <p className="text-sm font-medium text-gray-600">{nextLocked.name} — coming soon</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {daysLeft > 0
              ? `Unlocks in ${daysLeft} more day${daysLeft !== 1 ? 's' : ''}`
              : 'Almost ready to unlock!'}
          </p>
        </div>
      </div>
    </div>
  );
}
