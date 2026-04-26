import { useState } from 'react';
import type { Habit } from '../types';

interface Props {
  onAdd: (habit: Omit<Habit, 'id' | 'createdAt' | 'order'>) => void;
  onClose: () => void;
  prevHabitName: string;
}

export function AddHabitModal({ onAdd, onClose, prevHabitName }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'movement' | 'custom'>('custom');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [goalLabel, setGoalLabel] = useState('');
  const [unlockDays, setUnlockDays] = useState('14');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const base = {
      name: name.trim(),
      description: description.trim(),
      type: type as Habit['type'],
      unlocksNextAfterDays: parseInt(unlockDays) || 14,
    };

    if (type === 'movement') {
      onAdd({ ...base, durationMinutes: parseInt(durationMinutes) || 15 });
    } else {
      onAdd({ ...base, goalLabel: goalLabel.trim() });
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Add Next Habit</h2>
          <p className="text-sm text-gray-500 mt-1">
            This will unlock after you build your{' '}
            <span className="font-medium text-blue-600">{prevHabitName}</span> habit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Habit name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habit name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Morning stretch, Daily journaling…"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional short description"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'movement', label: '🏃 Movement', sub: 'Time-based activity' },
                { value: 'custom', label: '⭐ Custom', sub: 'Anything else' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value as 'movement' | 'custom')}
                  className={`p-3 rounded-xl border-2 text-left transition-colors ${
                    type === opt.value
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Type-specific fields */}
          {type === 'movement' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={durationMinutes}
                onChange={e => setDurationMinutes(e.target.value)}
                placeholder="15"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal / completion label
              </label>
              <input
                type="text"
                value={goalLabel}
                onChange={e => setGoalLabel(e.target.value)}
                placeholder="e.g. 1 page of journaling, 10 min meditation…"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Unlock threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How many consecutive days before the habit after this one unlocks?
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="365"
                value={unlockDays}
                onChange={e => setUnlockDays(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-500">consecutive days</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Complete this habit for {unlockDays || '?'} days in a row to unlock whatever comes next.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
