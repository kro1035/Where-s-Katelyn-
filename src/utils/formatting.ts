import { format, parseISO } from 'date-fns'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value)
}

export function formatDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'MMM d, yyyy')
  } catch {
    return isoDate
  }
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy')
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export function formatMonths(n: number): string {
  if (n === 1) return '1 month'
  if (n < 12) return `${n} months`
  const years = Math.floor(n / 12)
  const months = n % 12
  if (months === 0) return `${years} yr${years > 1 ? 's' : ''}`
  return `${years} yr${years > 1 ? 's' : ''} ${months} mo`
}
