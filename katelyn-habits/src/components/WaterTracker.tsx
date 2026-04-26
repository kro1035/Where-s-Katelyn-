import { useState } from 'react';
import type { HabitWithStatus } from '../types';
import { lastNDays, formatDisplayDate } from '../utils/dates';

interface Props {
  habit: HabitWithStatus;
  logs: Array<{ date: string; waterOz?: number; completed: boolean }>;
  onLogWater: (oz: number) => void;
  onSetWater: (oz: number) => void;
}

const QUICK_OZ = [8, 12, 16, 20, 24, 32];

export function WaterTracker({ habit, logs, onLogWater, onSetWater }: Props) {
  const [customOz, setCustomOz] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const minOz = habit.waterMinOz ?? 80;
  const maxOz = habit.waterMaxOz ?? 100;
  const currentOz = habit.todayWaterOz ?? 0;
  const pct = Math.min(100, (currentOz / maxOz) * 100);
  const goalMet = currentOz >= minOz;
  const inZone = currentOz >= minOz && currentOz <= maxOz;

  const history = lastNDays(7);
  const logMap = new Map(logs.map(l => [l.date, l]));

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(customOz);
    if (!isNaN(val) && val > 0) {
      onLogWater(val);
      setCustomOz('');
      setShowCustom(false);
    }
  }

  function handleSetDirectly(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(customOz);
    if (!isNaN(val) && val >= 0) {
      onSetWater(val);
      setCustomOz('');
      setShowCustom(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              💧 {habit.name}
            </h2>
            <p className="text-blue-100 text-sm mt-1">{habit.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentOz}</div>
            <div className="text-blue-200 text-xs">of {minOz}–{maxOz} oz</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Water bottle visual */}
        <div className="flex items-center gap-6">
          <div className="relative w-16 flex-shrink-0">
            <WaterBottle pct={pct} goalMet={goalMet} />
          </div>

          <div className="flex-1 space-y-2">
            {/* Progress bar */}
            <div className="relative h-5 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
              {/* Goal zone overlay */}
              <div
                className="absolute top-0 h-full bg-green-100 border-x border-green-300 opacity-60"
                style={{
                  left: `${(minOz / maxOz) * 100}%`,
                  width: `${((maxOz - minOz) / maxOz) * 100}%`,
                }}
              />
              {/* Fill */}
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                  goalMet ? 'bg-green-400' : 'bg-blue-400'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>0 oz</span>
              <span className="text-green-600 font-medium">Goal: {minOz}–{maxOz} oz</span>
              <span>{maxOz} oz</span>
            </div>

            {goalMet ? (
              <p className="text-green-600 text-sm font-medium">
                {inZone ? '✅ Goal met! Great hydration today.' : `✅ Goal crushed! ${currentOz - maxOz} oz over target.`}
              </p>
            ) : (
              <p className="text-blue-500 text-sm">
                {minOz - currentOz} oz to go until your goal
              </p>
            )}
          </div>
        </div>

        {/* Quick-add buttons */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Quick add</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_OZ.map(oz => (
              <button
                key={oz}
                onClick={() => onLogWater(oz)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors border border-blue-100"
              >
                +{oz} oz
              </button>
            ))}
            <button
              onClick={() => setShowCustom(v => !v)}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg transition-colors border border-gray-200"
            >
              Custom
            </button>
          </div>
        </div>

        {/* Custom amount form */}
        {showCustom && (
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <p className="text-sm text-blue-700 font-medium">Enter amount</p>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="300"
                placeholder="oz"
                value={customOz}
                onChange={e => setCustomOz(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                autoFocus
              />
              <button
                onClick={handleCustomSubmit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                + Add
              </button>
              <button
                onClick={handleSetDirectly}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                title="Set total directly"
              >
                Set total
              </button>
            </div>
            <p className="text-xs text-blue-500">
              "+ Add" adds to current total · "Set total" replaces it
            </p>
          </div>
        )}

        {/* Undo / reset */}
        {currentOz > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => onSetWater(0)}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Reset today
            </button>
          </div>
        )}

        {/* 7-day history */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Last 7 days</p>
          <div className="grid grid-cols-7 gap-1">
            {history.map(date => {
              const log = logMap.get(date);
              const oz = log?.waterOz ?? 0;
              const done = log?.completed ?? false;
              const isToday = date === new Date().toISOString().slice(0, 10);
              return (
                <div key={date} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                      done
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : oz > 0
                        ? 'bg-blue-100 text-blue-600 border border-blue-200'
                        : 'bg-gray-50 text-gray-300 border border-gray-100'
                    } ${isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                    title={`${formatDisplayDate(date)}: ${oz} oz`}
                  >
                    {done ? '✓' : oz > 0 ? oz : '–'}
                  </div>
                  <span className={`text-[10px] ${isToday ? 'text-blue-500 font-semibold' : 'text-gray-400'}`}>
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

function WaterBottle({ pct, goalMet }: { pct: number; goalMet: boolean }) {
  const fillHeight = Math.min(100, pct);
  return (
    <svg viewBox="0 0 40 80" className="w-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
      {/* Bottle cap */}
      <rect x="14" y="2" width="12" height="8" rx="3" fill="#cbd5e1" />
      {/* Bottle body outline */}
      <path
        d="M10 16 Q8 18 8 22 L8 68 Q8 72 12 72 L28 72 Q32 72 32 68 L32 22 Q32 18 30 16 L10 16 Z"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      {/* Water fill - clip to bottle shape */}
      <clipPath id="bottle-clip">
        <path d="M10 16 Q8 18 8 22 L8 68 Q8 72 12 72 L28 72 Q32 72 32 68 L32 22 Q32 18 30 16 L10 16 Z" />
      </clipPath>
      <rect
        x="8"
        y={72 - (56 * fillHeight) / 100}
        width="24"
        height={(56 * fillHeight) / 100}
        fill={goalMet ? '#4ade80' : '#60b7f9'}
        clipPath="url(#bottle-clip)"
        className="transition-all duration-500"
      />
      {/* Bottle outline on top of fill */}
      <path
        d="M10 16 Q8 18 8 22 L8 68 Q8 72 12 72 L28 72 Q32 72 32 68 L32 22 Q32 18 30 16 L10 16 Z"
        fill="none"
        stroke={goalMet ? '#22c55e' : '#93c5fd'}
        strokeWidth="1.5"
      />
      {/* Neck */}
      <path d="M14 10 L14 16 L26 16 L26 10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
    </svg>
  );
}
