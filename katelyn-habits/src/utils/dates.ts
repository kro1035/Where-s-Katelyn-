export function toDateStr(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function today(): string {
  return toDateStr(new Date());
}

// Returns streak: number of consecutive days ending today (or yesterday) that are completed
export function calcStreak(completedDates: Set<string>): number {
  let streak = 0;
  const d = new Date();

  // If today isn't completed yet, start checking from yesterday
  if (!completedDates.has(toDateStr(d))) {
    d.setDate(d.getDate() - 1);
  }

  while (completedDates.has(toDateStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

// Returns last N days as YYYY-MM-DD strings, oldest first
export function lastNDays(n: number): string[] {
  const days: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dd = new Date(d);
    dd.setDate(d.getDate() - i);
    days.push(toDateStr(dd));
  }
  return days;
}

export function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
