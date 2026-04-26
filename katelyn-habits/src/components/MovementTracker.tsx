import { useState } from 'react';
import type { HabitWithStatus } from '../types';
import { lastNDays, formatDisplayDate } from '../utils/dates';

interface Props {
  habit: HabitWithStatus;
  logs: Array<{ date: string; completed: boolean; notes?: string }>;
  onToggle: () => void;
}

const MOVEMENT_IDEAS = [
  'Walk around the block',
  'Stretch & foam roll',
  'Dance to a few songs',
  'Yoga or body weight flow',
  'Bike ride',
  'Jump rope',
  'Swim',
  'Hike',
];

export function MovementTracker({ habit, logs, onToggle }: Props) {
  const [showIdeas, setShowIdeas] = useState(false);
  const done = habit.todayCompleted;
  const duration = habit.durationMinutes ?? 15;

  const history = lastNDays(7);
  const logMap = new Map(logs.map(l => [l.date, l]));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-5 text-white ${done ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              🏃 {habit.name}
            </h2>
            <p className="text-green-100 text-sm mt-1">{habit.description}</p>
          </div>
          {done && (
            <div className="text-4xl">✅</div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main action */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className={`text-5xl transition-transform duration-300 ${done ? 'scale-125' : ''}`}>
            {done ? '🎉' : '🏃‍♀️'}
          </div>
          <p className="text-gray-500 text-sm text-center">
            {done
              ? `Amazing! You got your ${duration} minutes in today.`
              : `Just ${duration} minutes of movement — anything counts!`}
          </p>
          <button
            onClick={onToggle}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
              done
                ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 border border-gray-200'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-200'
            }`}
          >
            {done ? 'Undo' : `Mark ${duration} min complete ✓`}
          </button>
        </div>

        {/* Movement ideas */}
        <div>
          <button
            onClick={() => setShowIdeas(v => !v)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            {showIdeas ? '▾' : '▸'} Need ideas?
          </button>
          {showIdeas && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {MOVEMENT_IDEAS.map(idea => (
                <div key={idea} className="bg-green-50 rounded-lg px-3 py-2 text-sm text-green-700 border border-green-100">
                  {idea}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7-day history */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Last 7 days</p>
          <div className="grid grid-cols-7 gap-1">
            {history.map(date => {
              const log = logMap.get(date);
              const done = log?.completed ?? false;
              const isToday = date === new Date().toISOString().slice(0, 10);
              return (
                <div key={date} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                      done
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-50 text-gray-300 border border-gray-100'
                    } ${isToday ? 'ring-2 ring-green-400 ring-offset-1' : ''}`}
                    title={`${formatDisplayDate(date)}: ${done ? 'Done' : 'Not done'}`}
                  >
                    {done ? '✓' : '–'}
                  </div>
                  <span className={`text-[10px] ${isToday ? 'text-green-500 font-semibold' : 'text-gray-400'}`}>
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
