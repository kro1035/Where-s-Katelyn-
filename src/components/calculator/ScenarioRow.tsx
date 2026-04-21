import type { PayoffScenario } from '@/types'
import { formatCurrency, formatMonthYear, formatMonths } from '@/utils/formatting'

interface ScenarioRowProps {
  scenario: PayoffScenario
  isMinimum: boolean
}

export function ScenarioRow({ scenario, isMinimum }: ScenarioRowProps) {
  const noPayoff = !scenario.payoffDate || scenario.monthsToPayoff === null

  return (
    <tr className={`${isMinimum ? 'bg-indigo-50/50' : 'hover:bg-slate-50'} transition-colors`}>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">{scenario.label}</span>
          {isMinimum && (
            <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">Baseline</span>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{formatCurrency(scenario.monthlyPayment)}/mo</div>
      </td>

      {noPayoff ? (
        <>
          <td className="px-4 py-3.5" colSpan={4}>
            <div className="flex items-center gap-2 text-rose-600">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">Payment doesn't cover interest — balance grows</span>
            </div>
          </td>
        </>
      ) : (
        <>
          <td className="px-4 py-3.5">
            <div className="text-sm font-semibold text-slate-900">{formatMonthYear(scenario.payoffDate!)}</div>
          </td>
          <td className="px-4 py-3.5">
            <div className="text-sm text-slate-700 tabular-nums">{formatMonths(scenario.monthsToPayoff!)}</div>
          </td>
          <td className="px-4 py-3.5">
            <div className="text-sm text-rose-600 tabular-nums font-medium">{formatCurrency(scenario.totalInterestPaid)}</div>
          </td>
          <td className="px-4 py-3.5">
            <div className="text-sm font-semibold text-slate-900 tabular-nums">{formatCurrency(scenario.totalPaid)}</div>
          </td>
        </>
      )}
    </tr>
  )
}
