export const STORAGE_KEY = 'loan-tracker-v1'

export const SCENARIO_OFFSETS = [0, 50, 100, 200]

export const SCENARIO_LABELS: Record<number, string> = {
  0: 'Minimum Payment',
  50: 'Minimum + $50',
  100: 'Minimum + $100',
  200: 'Minimum + $200',
}
