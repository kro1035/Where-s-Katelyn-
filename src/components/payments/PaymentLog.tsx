import { useState } from 'react'
import type { Loan, Payment, PaymentLedgerRow } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PaymentForm } from './PaymentForm'
import { PaymentRow } from './PaymentRow'

interface PaymentLogProps {
  loan: Loan
  ledger: PaymentLedgerRow[]
  onAddPayment: (data: Omit<Payment, 'id' | 'createdAt'>) => void
  onDeletePayment: (id: string) => void
}

export function PaymentLog({ loan, ledger, onAddPayment, onDeletePayment }: PaymentLogProps) {
  const [showForm, setShowForm] = useState(false)
  // Show newest payments first
  const reversed = [...ledger].reverse()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Payment
        </Button>
      </div>

      {ledger.length === 0 ? (
        <Card>
          <EmptyState
            icon={
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="No payments logged yet"
            description="Log your first payment to start tracking your progress toward payoff."
            action={{ label: 'Log First Payment', onClick: () => setShowForm(true) }}
          />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Interest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Principal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Balance After</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Note</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reversed.map((row, i) => (
                  <PaymentRow
                    key={row.payment.id}
                    row={row}
                    index={ledger.length - 1 - i}
                    onDelete={onDeletePayment}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <PaymentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={onAddPayment}
        loanId={loan.id}
      />
    </div>
  )
}
