import type { HabitWithStatus } from '../types';
import { StreakBadge } from './StreakBadge';

interface Props {
  habits: HabitWithStatus[];
  onAddHabit: () => void;
}

export function HabitChain({ habits, onAddHabit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-800">Your Habit Chain</h2>
        <button
          onClick={onAddHabit}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add next habit
        </button>
      </div>

      <div className="relative">
        {habits.map((habit, idx) => (
          <div key={habit.id} className="relative">
            {/* Connector line */}
            {idx < habits.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-8 bg-gray-200 z-0" />
            )}

            <div
              className={`relative z-10 flex items-start gap-4 mb-2 ${
                idx < habits.length - 1 ? 'pb-8' : ''
              }`}
            >
              {/* Status icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg border-2 ${
                  habit.status === 'mastered'
                    ? 'bg-green-100 border-green-300'
                    : habit.status === 'active'
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-gray-100 border-gray-200'
                }`}
              >
                {habit.status === 'mastered'
                  ? '⭐'
                  : habit.status === 'active'
                  ? habitEmoji(habit.type)
                  : '🔒'}
              </div>

              {/* Habit info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-medium text-sm ${
                      habit.status === 'locked' ? 'text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {habit.name}
                  </span>
                  <StatusPill status={habit.status} />
                </div>

                {habit.status !== 'locked' && (
                  <div className="mt-2">
                    <StreakBadge
                      streak={habit.streak}
                      target={habit.unlocksNextAfterDays}
                      compact
                    />
                  </div>
                )}

                {habit.status === 'locked' && (
                  <p className="text-xs text-gray-400 mt-1">
                    Complete the previous habit to unlock
                  </p>
                )}

                {habit.status === 'active' && habit.daysUntilUnlock > 0 && idx < habits.length - 1 && (
                  <p className="text-xs text-blue-500 mt-1">
                    {habit.daysUntilUnlock} more day{habit.daysUntilUnlock !== 1 ? 's' : ''} to unlock next habit
                  </p>
                )}

                {habit.status === 'active' && habit.daysUntilUnlock === 0 && idx < habits.length - 1 && (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    🎉 Next habit unlocked!
                  </p>
                )}
              </div>

              {/* Today indicator */}
              {habit.status === 'active' && (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                    habit.todayCompleted
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  title={habit.todayCompleted ? "Done today" : "Not done today"}
                >
                  {habit.todayCompleted ? '✓' : '○'}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add button at end of chain */}
        <div className="flex items-center gap-4 mt-2">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-300 text-lg">+</span>
          </div>
          <button
            onClick={onAddHabit}
            className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
          >
            Add a habit for after you've built the current ones…
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: HabitWithStatus['status'] }) {
  if (status === 'active') {
    return (
      <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">
        Active
      </span>
    );
  }
  if (status === 'mastered') {
    return (
      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-medium">
        Mastered
      </span>
    );
  }
  return (
    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full font-medium">
      Locked
    </span>
  );
}

function habitEmoji(type: string) {
  if (type === 'water') return '💧';
  if (type === 'movement') return '🏃';
  return '⭐';
}
