import type { PayoffScenario } from '@/types'
import { ScenarioRow } from './ScenarioRow'

interface ScenarioTableProps {
  scenarios: PayoffScenario[]
}

export function ScenarioTable({ scenarios }: ScenarioTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Scenario</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Payoff Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Time to Payoff</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Interest Paid</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Paid</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {scenarios.map((s, i) => (
            <ScenarioRow key={s.label} scenario={s} isMinimum={i === 0} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
