import { useState } from 'react'
import { format } from 'date-fns'
import type { Loan } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface LoanFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'>) => void
  initialValues?: Loan
}

interface FormErrors {
  name?: string
  principal?: string
  interestRate?: string
  minimumPayment?: string
  startDate?: string
}

const today = format(new Date(), 'yyyy-MM-dd')

function validate(values: {
  name: string
  principal: string
  interestRate: string
  minimumPayment: string
  startDate: string
}): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Loan name is required'
  if (!values.principal || Number(values.principal) <= 0) errors.principal = 'Enter a positive balance'
  if (!values.interestRate || Number(values.interestRate) < 0) errors.interestRate = 'Enter a valid rate (0 or higher)'
  if (!values.minimumPayment || Number(values.minimumPayment) <= 0) errors.minimumPayment = 'Enter a positive payment'
  if (!values.startDate) errors.startDate = 'Start date is required'
  return errors
}

export function LoanForm({ isOpen, onClose, onSubmit, initialValues }: LoanFormProps) {
  const [values, setValues] = useState({
    name: initialValues?.name ?? '',
    principal: initialValues ? String(initialValues.principal) : '',
    interestRate: initialValues ? String(initialValues.interestRate) : '',
    minimumPayment: initialValues ? String(initialValues.minimumPayment) : '',
    startDate: initialValues?.startDate ?? today,
    notes: initialValues?.notes ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function set(field: string, value: string) {
    setValues(v => ({ ...v, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(values)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({
      name: values.name.trim(),
      principal: Number(values.principal),
      interestRate: Number(values.interestRate),
      minimumPayment: Number(values.minimumPayment),
      startDate: values.startDate,
      notes: values.notes.trim() || undefined,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialValues ? 'Edit Loan' : 'Add New Loan'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Loan Name"
          placeholder="e.g. Student Loan — Navient"
          value={values.name}
          onChange={e => set('name', e.target.value)}
          error={errors.name}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Beginning Balance"
            type="number"
            min="0.01"
            step="0.01"
            prefix="$"
            placeholder="10000.00"
            value={values.principal}
            onChange={e => set('principal', e.target.value)}
            error={errors.principal}
            required
          />
          <Input
            label="Interest Rate (APR)"
            type="number"
            min="0"
            max="100"
            step="0.01"
            suffix="%"
            placeholder="6.50"
            value={values.interestRate}
            onChange={e => set('interestRate', e.target.value)}
            error={errors.interestRate}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Minimum Monthly Payment"
            type="number"
            min="0.01"
            step="0.01"
            prefix="$"
            placeholder="200.00"
            value={values.minimumPayment}
            onChange={e => set('minimumPayment', e.target.value)}
            error={errors.minimumPayment}
            required
          />
          <Input
            label="Loan Start Date"
            type="date"
            value={values.startDate}
            onChange={e => set('startDate', e.target.value)}
            error={errors.startDate}
            required
          />
        </div>
        <Input
          label="Notes (optional)"
          placeholder="Any additional details..."
          value={values.notes}
          onChange={e => set('notes', e.target.value)}
        />
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">{initialValues ? 'Save Changes' : 'Add Loan'}</Button>
        </div>
      </form>
    </Modal>
  )
}
