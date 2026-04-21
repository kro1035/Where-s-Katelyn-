import { Input } from '@/components/ui/Input'

interface CustomAmountInputProps {
  value: string
  onChange: (value: string) => void
  minimumPayment: number
}

export function CustomAmountInput({ value, onChange, minimumPayment }: CustomAmountInputProps) {
  return (
    <div className="flex items-end gap-4 flex-wrap">
      <div className="w-52">
        <Input
          label="Custom Monthly Payment"
          type="number"
          min="0.01"
          step="0.01"
          prefix="$"
          placeholder={String(minimumPayment + 50)}
          value={value}
          onChange={e => onChange(e.target.value)}
          helpText="See how a custom amount changes your payoff date"
        />
      </div>
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-xs text-slate-400 hover:text-slate-600 mb-1 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  )
}
