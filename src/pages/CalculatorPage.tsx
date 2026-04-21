import type { Loan, PaymentLedgerRow } from '@/types'
import { PaymentCalculator } from '@/components/calculator/PaymentCalculator'

interface CalculatorPageProps {
  loan: Loan
  ledger: PaymentLedgerRow[]
}

export function CalculatorPage({ loan, ledger }: CalculatorPageProps) {
  const currentBalance = ledger.length > 0 ? ledger[ledger.length - 1].balanceAfter : loan.principal

  return (
    <div className="p-6 max-w-4xl">
      <PaymentCalculator loan={loan} currentBalance={currentBalance} />
    </div>
  )
}
