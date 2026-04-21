import type { Loan } from '@/types'
import { usePayoffScenarios } from '@/hooks/usePayoffScenarios'
import { Card } from '@/components/ui/Card'
import { ScenarioTable } from './ScenarioTable'
import { CustomAmountInput } from './CustomAmountInput'
import { formatCurrency, formatPercent } from '@/utils/formatting'

interface PaymentCalculatorProps {
  loan: Loan
  currentBalance: number
}

export function PaymentCalculator({ loan, currentBalance }: PaymentCalculatorProps) {
  const { scenarios, customAmount, setCustomAmount } = usePayoffScenarios(loan, currentBalance)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Calculator</h1>
        <p className="text-sm text-slate-500 mt-1">
          See how different monthly payment amounts affect your payoff date and total interest for <span className="font-medium text-slate-700">{loan.name}</span>.
        </p>
      </div>

      {/* Loan summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-500 mb-0.5">Current Balance</p>
          <p className="text-lg font-bold text-slate-900 tabular-nums">{formatCurrency(currentBalance)}</p>
        </div>
        <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-500 mb-0.5">Interest Rate</p>
          <p className="text-lg font-bold text-slate-900">{formatPercent(loan.interestRate)} APR</p>
        </div>
        <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-500 mb-0.5">Min. Payment</p>
          <p className="text-lg font-bold text-slate-900 tabular-nums">{formatCurrency(loan.minimumPayment)}/mo</p>
        </div>
      </div>

      {/* Scenario table */}
      <Card padding={false}>
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Payment Scenarios</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calculated from today's current balance using monthly amortization</p>
        </div>
        <ScenarioTable scenarios={scenarios} />
        <div className="px-6 py-4 border-t border-slate-100">
          <CustomAmountInput value={customAmount} onChange={setCustomAmount} minimumPayment={loan.minimumPayment} />
        </div>
      </Card>

      {/* Formula callout */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-800 mb-1">How Payoff is Calculated</p>
            <p className="text-sm text-indigo-700 leading-relaxed">
              Using the standard loan amortization formula:{' '}
              <code className="bg-indigo-100 px-1.5 py-0.5 rounded text-xs font-mono">n = -log(1 − r·P/M) / log(1+r)</code>{' '}
              where <strong>P</strong> is the current balance, <strong>r</strong> is the monthly interest rate (APR ÷ 12 ÷ 100), and <strong>M</strong> is the monthly payment.
              Each extra dollar you pay above the interest goes directly toward your principal, accelerating payoff significantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
