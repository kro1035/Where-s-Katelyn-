import type { Loan, Payment, PaymentLedgerRow } from '@/types'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { PaymentLog } from '@/components/payments/PaymentLog'

interface LoanDetailPageProps {
  loan: Loan
  ledger: PaymentLedgerRow[]
  onAddPayment: (data: Omit<Payment, 'id' | 'createdAt'>) => void
  onDeletePayment: (id: string) => void
  onEditLoan: () => void
}

export function LoanDetailPage({ loan, ledger, onAddPayment, onDeletePayment, onEditLoan }: LoanDetailPageProps) {
  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <Dashboard loan={loan} ledger={ledger} onEdit={onEditLoan} />
      <PaymentLog loan={loan} ledger={ledger} onAddPayment={onAddPayment} onDeletePayment={onDeletePayment} />
    </div>
  )
}
