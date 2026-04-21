import { useMemo } from 'react'
import type { Loan, Payment } from '@/types'
import { buildLedger } from '@/utils/financial'

export function useLedger(loan: Loan, payments: Payment[]) {
  return useMemo(() => buildLedger(loan, payments), [loan, payments])
}
