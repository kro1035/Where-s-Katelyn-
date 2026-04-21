import type { PaymentLedgerRow } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatting'

interface PaymentRowProps {
  row: PaymentLedgerRow
  index: number
  onDelete: (id: string) => void
}

export function PaymentRow({ row, index, onDelete }: PaymentRowProps) {
  const { payment, interestPaid, principalPaid, balanceAfter } = row

  return (
    <tr className="hover:bg-slate-50 group">
      <td className="px-4 py-3 text-sm text-slate-500 tabular-nums">#{index + 1}</td>
      <td className="px-4 py-3 text-sm text-slate-700">{formatDate(payment.date)}</td>
      <td className="px-4 py-3 text-sm font-semibold text-slate-900 tabular-nums">{formatCurrency(payment.amount)}</td>
      <td className="px-4 py-3 text-sm text-rose-600 tabular-nums">{formatCurrency(interestPaid)}</td>
      <td className="px-4 py-3 text-sm text-emerald-600 tabular-nums">{formatCurrency(principalPaid)}</td>
      <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{formatCurrency(balanceAfter)}</td>
      <td className="px-4 py-3 text-sm text-slate-500 max-w-[140px] truncate">{payment.note ?? '—'}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => onDelete(payment.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1 rounded"
          title="Delete payment"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  )
}
