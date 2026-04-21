import { formatMonthYear } from '@/utils/formatting'

interface PayoffDateBadgeProps {
  payoffDate: Date | null
  monthsToPayoff: number | null
}

export function PayoffDateBadge({ payoffDate, monthsToPayoff }: PayoffDateBadgeProps) {
  if (!payoffDate || monthsToPayoff === null) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-rose-800">Payment Below Interest</p>
          <p className="text-xs text-rose-600 mt-0.5">Increase your payment to cover accruing interest</p>
        </div>
      </div>
    )
  }

  const months = monthsToPayoff
  const yearsLabel = months >= 12
    ? `${Math.floor(months / 12)} yr${Math.floor(months / 12) > 1 ? 's' : ''} ${months % 12 > 0 ? `${months % 12} mo` : ''}`.trim()
    : `${months} month${months > 1 ? 's' : ''}`

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-800">Estimated Payoff</p>
        <p className="text-lg font-bold text-emerald-700">{formatMonthYear(payoffDate)}</p>
        <p className="text-xs text-emerald-600">{yearsLabel} at minimum payment</p>
      </div>
    </div>
  )
}
