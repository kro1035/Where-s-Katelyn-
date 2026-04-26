interface Props {
  streak: number;
  target: number;
  compact?: boolean;
}

export function StreakBadge({ streak, target, compact = false }: Props) {
  const pct = Math.min(100, (streak / target) * 100);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-orange-400">🔥</span>
        <span className="font-semibold text-gray-700">{streak}</span>
        <span className="text-gray-400">/ {target} day streak</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-orange-500 font-medium">
          🔥 {streak} day streak
        </span>
        <span className="text-gray-400">{target - streak > 0 ? `${target - streak} days to unlock next` : 'Ready to unlock!'}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>Day 1</span>
        <span>Day {target} → unlock next habit</span>
      </div>
    </div>
  );
}
