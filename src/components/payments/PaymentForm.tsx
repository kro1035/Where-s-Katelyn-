import { useState } from 'react'
import { format } from 'date-fns'
import type { Payment } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface PaymentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Payment, 'id' | 'createdAt'>) => void
  loanId: string
}

interface FormErrors {
  amount?: string
  date?: string
}

const today = format(new Date(), 'yyyy-MM-dd')

export function PaymentForm({ isOpen, onClose, onSubmit, loanId }: PaymentFormProps) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  function reset() { setAmount(''); setDate(today); setNote(''); setErrors({}) }

  function handleClose() { reset(); onClose() }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: FormErrors = {}
    if (!amount || Number(amount) <= 0) errs.amount = 'Enter a positive amount'
    if (!date) errs.date = 'Date is required'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({ loanId, amount: Number(amount), date, note: note.trim() || undefined })
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Payment Amount"
            type="number"
            min="0.01"
            step="0.01"
            prefix="$"
            placeholder="200.00"
            value={amount}
            onChange={e => { setAmount(e.target.value); setErrors(er => ({ ...er, amount: undefined })) }}
            error={errors.amount}
            required
            autoFocus
          />
          <Input
            label="Payment Date"
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setErrors(er => ({ ...er, date: undefined })) }}
            error={errors.date}
            required
          />
        </div>
        <Input
          label="Note (optional)"
          placeholder="e.g. Extra payment, tax refund..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>Cancel</Button>
          <Button type="submit" className="flex-1">Log Payment</Button>
        </div>
      </form>
    </Modal>
  )
}
