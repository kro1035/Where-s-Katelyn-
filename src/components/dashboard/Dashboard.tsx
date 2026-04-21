import type { Loan, PaymentLedgerRow } from '@/types'
import { formatCurrency, formatPercent } from '@/utils/formatting'
import { calculateScenario } from '@/utils/financial'
import { StatCard } from './StatCard'
import { ProgressBar } from './ProgressBar'
import { PayoffDateBadge } from './PayoffDateBadge'
import { Card } from '@/components/ui/Card'

interface DashboardProps {
  loan: Loan
  ledger: PaymentLedgerRow[]
  onEdit: () => void
}

export function Dashboard({ loan, ledger, onEdit }: DashboardProps) {
  const currentBalance = ledger.length > 0 ? ledger[ledger.length - 1].balanceAfter : loan.principal
  const totalPaid = ledger.reduce((sum, r) => sum + r.payment.amount, 0)
  const totalInterestPaid = ledger.reduce((sum, r) => sum + r.interestPaid, 0)
  const minScenario = calculateScenario(currentBalance, loan.interestRate, loan.minimumPayment, 'Minimum Payment')

  return (
    <div className="space-y-6">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{loan.name}</h1>
          {loan.notes && <p className="text-sm text-slate-500 mt-1">{loan.notes}</p>}
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Loan
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Beginning Balance"
          value={formatCurrency(loan.principal)}
          subValue={`Started ${new Date(loan.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
          iconBg="bg-slate-100"
          icon={
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Current Balance"
          value={formatCurrency(currentBalance)}
          subValue={`${formatPercent(loan.interestRate)} APR`}
          iconBg="bg-indigo-100"
          icon={
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Paid"
          value={formatCurrency(totalPaid)}
          subValue={`${formatCurrency(totalInterestPaid)} in interest`}
          iconBg="bg-emerald-100"
          valueColor="text-emerald-700"
          icon={
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Min. Monthly Payment"
          value={formatCurrency(loan.minimumPayment)}
          subValue={`${ledger.length} payment${ledger.length !== 1 ? 's' : ''} logged`}
          iconBg="bg-amber-100"
          icon={
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Payoff date */}
      <PayoffDateBadge payoffDate={minScenario.payoffDate} monthsToPayoff={minScenario.monthsToPayoff} />

      {/* Progress */}
      <Card>
        <p className="text-sm font-semibold text-slate-700 mb-4">Payoff Progress</p>
        <ProgressBar principal={loan.principal} currentBalance={currentBalance} />
        <div className="flex justify-between text-sm mt-3">
          <span className="text-slate-500">Paid: <span className="font-semibold text-slate-700">{formatCurrency(Math.max(0, loan.principal - currentBalance))}</span></span>
          <span className="text-slate-500">Remaining: <span className="font-semibold text-slate-700">{formatCurrency(currentBalance)}</span></span>
        </div>
      </Card>
    </div>
  )
}
