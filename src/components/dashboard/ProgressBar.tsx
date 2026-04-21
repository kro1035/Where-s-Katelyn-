interface ProgressBarProps {
  principal: number
  currentBalance: number
}

export function ProgressBar({ principal, currentBalance }: ProgressBarProps) {
  const paid = Math.max(0, principal - currentBalance)
  const pct = principal > 0 ? Math.min(100, (paid / principal) * 100) : 0

  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
        <span>{pct.toFixed(1)}% paid off</span>
        <span>{(100 - pct).toFixed(1)}% remaining</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
