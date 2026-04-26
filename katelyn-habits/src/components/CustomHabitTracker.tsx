import type { HabitWithStatus } from '../types';
import { lastNDays, formatDisplayDate } from '../utils/dates';

interface Props {
  habit: HabitWithStatus;
  logs: Array<{ date: string; completed: boolean }>;
  onToggle: () => void;
}

export function CustomHabitTracker({ habit, logs, onToggle }: Props) {
  const done = habit.todayCompleted;
  const history = lastNDays(7);
  const logMap = new Map(logs.map(l => [l.date, l]));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className={`px-6 py-5 text-white ${done ? 'bg-gradient-to-r from-purple-500 to-violet-400' : 'bg-gradient-to-r from-violet-500 to-purple-400'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">⭐ {habit.name}</h2>
            <p className="text-purple-100 text-sm mt-1">{habit.description}</p>
          </div>
          {done && <div className="text-4xl">✅</div>}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {habit.goalLabel && (
          <div className="bg-purple-50 rounded-xl px-4 py-3 text-sm text-purple-700 border border-purple-100">
            <span className="font-medium">Goal:</span> {habit.goalLabel}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 py-2">
          <p className="text-gray-500 text-sm text-center">
            {done ? 'Great job completing this today!' : 'Did you complete this habit today?'}
          </p>
          <button
            onClick={onToggle}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
              done
                ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 border border-gray-200'
                : 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm shadow-purple-200'
            }`}
          >
            {done ? 'Undo' : 'Mark complete ✓'}
          </button>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Last 7 days</p>
          <div className="grid grid-cols-7 gap-1">
            {history.map(date => {
              const log = logMap.get(date);
              const completed = log?.completed ?? false;
              const isToday = date === new Date().toISOString().slice(0, 10);
              return (
                <div key={date} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                      completed
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-50 text-gray-300 border border-gray-100'
                    } ${isToday ? 'ring-2 ring-purple-400 ring-offset-1' : ''}`}
                    title={`${formatDisplayDate(date)}: ${completed ? 'Done' : 'Not done'}`}
                  >
                    {completed ? '✓' : '–'}
                  </div>
                  <span className={`text-[10px] ${isToday ? 'text-purple-500 font-semibold' : 'text-gray-400'}`}>
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
