export interface Loan {
  id: string
  name: string
  principal: number
  currentBalance: number
  interestRate: number
  minimumPayment: number
  startDate: string
  createdAt: string
  updatedAt: string
  notes?: string
}

export interface Payment {
  id: string
  loanId: string
  date: string
  amount: number
  note?: string
  createdAt: string
}

export interface PaymentLedgerRow {
  payment: Payment
  principalPaid: number
  interestPaid: number
  balanceAfter: number
}

export interface PayoffScenario {
  monthlyPayment: number
  label: string
  payoffDate: Date | null
  totalInterestPaid: number
  totalPaid: number
  monthsToPayoff: number | null
}

export interface LoanStore {
  loans: Loan[]
  payments: Payment[]
}
