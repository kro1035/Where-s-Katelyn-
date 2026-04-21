import { useState, useMemo } from 'react'
import type { Loan, PayoffScenario } from '@/types'
import { calculateScenario } from '@/utils/financial'
import { SCENARIO_OFFSETS, SCENARIO_LABELS } from '@/constants'

export function usePayoffScenarios(loan: Loan, currentBalance: number) {
  const [customAmount, setCustomAmount] = useState('')

  const scenarios = useMemo<PayoffScenario[]>(() => {
    const min = loan.minimumPayment
    const base = SCENARIO_OFFSETS.map(offset =>
      calculateScenario(currentBalance, loan.interestRate, min + offset, SCENARIO_LABELS[offset])
    )
    const custom = Number(customAmount)
    if (custom > 0) {
      base.push(calculateScenario(currentBalance, loan.interestRate, custom, 'Custom Amount'))
    }
    return base
  }, [loan, currentBalance, customAmount])

  return { scenarios, customAmount, setCustomAmount }
}
