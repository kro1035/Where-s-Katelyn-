import { addMonths } from 'date-fns'
import type { Loan, Payment, PaymentLedgerRow, PayoffScenario } from '@/types'

export function buildLedger(loan: Loan, payments: Payment[]): PaymentLedgerRow[] {
  const sorted = [...payments].sort((a, b) => a.date.localeCompare(b.date))
  const monthlyRate = loan.interestRate / 100 / 12
  let balance = loan.principal
  const rows: PaymentLedgerRow[] = []

  for (const payment of sorted) {
    const interestPaid = balance * monthlyRate
    const principalPaid = Math.max(0, payment.amount - interestPaid)
    balance = Math.max(0, balance - principalPaid)
    rows.push({ payment, interestPaid, principalPaid, balanceAfter: balance })
  }

  return rows
}

export function getCurrentBalance(loan: Loan, payments: Payment[]): number {
  if (payments.length === 0) return loan.principal
  const ledger = buildLedger(loan, payments)
  return ledger[ledger.length - 1].balanceAfter
}

export function calculateScenario(
  currentBalance: number,
  annualRate: number,
  monthlyPayment: number,
  label: string,
): PayoffScenario {
  const r = annualRate / 100 / 12

  if (monthlyPayment <= 0) {
    return { monthlyPayment, label, payoffDate: null, totalInterestPaid: 0, totalPaid: 0, monthsToPayoff: null }
  }

  if (r === 0) {
    const months = Math.ceil(currentBalance / monthlyPayment)
    return {
      monthlyPayment,
      label,
      monthsToPayoff: months,
      payoffDate: addMonths(new Date(), months),
      totalPaid: monthlyPayment * months,
      totalInterestPaid: 0,
    }
  }

  // Payment doesn't cover interest — balance grows forever
  if (monthlyPayment <= r * currentBalance) {
    return { monthlyPayment, label, payoffDate: null, totalInterestPaid: 0, totalPaid: 0, monthsToPayoff: null }
  }

  const n = -Math.log(1 - (r * currentBalance) / monthlyPayment) / Math.log(1 + r)
  const months = Math.ceil(n)
  const totalPaid = monthlyPayment * months
  const totalInterest = Math.max(0, totalPaid - currentBalance)

  return {
    monthlyPayment,
    label,
    monthsToPayoff: months,
    payoffDate: addMonths(new Date(), months),
    totalPaid,
    totalInterestPaid: totalInterest,
  }
}

export function paymentCoversInterest(balance: number, annualRate: number, payment: number): boolean {
  const r = annualRate / 100 / 12
  return payment > r * balance
}
