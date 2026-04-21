import { useReducer, useEffect, useState, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Loan, Payment, LoanStore } from '@/types'
import { getCurrentBalance } from '@/utils/financial'

type Action =
  | { type: 'HYDRATE'; payload: LoanStore }
  | { type: 'ADD_LOAN'; payload: Loan }
  | { type: 'UPDATE_LOAN'; payload: Loan }
  | { type: 'DELETE_LOAN'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string }

function reducer(state: LoanStore, action: Action): LoanStore {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload

    case 'ADD_LOAN':
      return { ...state, loans: [...state.loans, action.payload] }

    case 'UPDATE_LOAN':
      return {
        ...state,
        loans: state.loans.map(l => l.id === action.payload.id ? action.payload : l),
      }

    case 'DELETE_LOAN':
      return {
        loans: state.loans.filter(l => l.id !== action.payload),
        payments: state.payments.filter(p => p.loanId !== action.payload),
      }

    case 'ADD_PAYMENT': {
      const payment = action.payload
      const loan = state.loans.find(l => l.id === payment.loanId)
      if (!loan) return state
      const paymentsForLoan = [...state.payments.filter(p => p.loanId === payment.loanId), payment]
      const newBalance = getCurrentBalance(loan, paymentsForLoan)
      const updatedLoan: Loan = { ...loan, currentBalance: newBalance, updatedAt: new Date().toISOString() }
      return {
        loans: state.loans.map(l => l.id === updatedLoan.id ? updatedLoan : l),
        payments: [...state.payments, payment],
      }
    }

    case 'DELETE_PAYMENT': {
      const remaining = state.payments.filter(p => p.id !== action.payload)
      const deleted = state.payments.find(p => p.id === action.payload)
      if (!deleted) return state
      const loan = state.loans.find(l => l.id === deleted.loanId)
      if (!loan) return { ...state, payments: remaining }
      const paymentsForLoan = remaining.filter(p => p.loanId === loan.id)
      const newBalance = getCurrentBalance(loan, paymentsForLoan)
      const updatedLoan: Loan = { ...loan, currentBalance: newBalance, updatedAt: new Date().toISOString() }
      return {
        loans: state.loans.map(l => l.id === updatedLoan.id ? updatedLoan : l),
        payments: remaining,
      }
    }

    default:
      return state
  }
}

export function useLoanStore(householdId: string) {
  const [state, dispatch] = useReducer(reducer, { loans: [], payments: [] })
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Track the last serialized state we wrote so we can skip our own echoed snapshots
  const lastWritten = useRef<string>('')

  // Subscribe to Firestore in real time
  useEffect(() => {
    const ref = doc(db, 'households', householdId)
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setIsLoaded(true)
        return
      }
      const data = snap.data() as LoanStore
      const serialized = JSON.stringify(data)

      // Skip if this is the echo of our own write
      if (serialized === lastWritten.current) {
        setIsLoaded(true)
        return
      }

      lastWritten.current = serialized
      dispatch({ type: 'HYDRATE', payload: data })

      // Auto-select single loan
      if (data.loans.length === 1) {
        setSelectedLoanId(id => id ?? data.loans[0].id)
      }
      setIsLoaded(true)
    })
    return unsub
  }, [householdId])

  // Persist to Firestore whenever state changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return
    const serialized = JSON.stringify(state)
    if (serialized === lastWritten.current) return
    lastWritten.current = serialized
    setDoc(doc(db, 'households', householdId), state).catch(console.error)
  }, [state, householdId, isLoaded])

  const addLoan = useCallback((data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'>) => {
    const loan: Loan = {
      ...data,
      id: uuidv4(),
      currentBalance: data.principal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_LOAN', payload: loan })
    setSelectedLoanId(loan.id)
    return loan
  }, [])

  const updateLoan = useCallback((loan: Loan) => {
    dispatch({ type: 'UPDATE_LOAN', payload: { ...loan, updatedAt: new Date().toISOString() } })
  }, [])

  const deleteLoan = useCallback((loanId: string) => {
    dispatch({ type: 'DELETE_LOAN', payload: loanId })
    setSelectedLoanId(prev => prev === loanId ? null : prev)
  }, [])

  const addPayment = useCallback((data: Omit<Payment, 'id' | 'createdAt'>) => {
    const payment: Payment = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_PAYMENT', payload: payment })
    return payment
  }, [])

  const deletePayment = useCallback((paymentId: string) => {
    dispatch({ type: 'DELETE_PAYMENT', payload: paymentId })
  }, [])

  const getPaymentsForLoan = useCallback((loanId: string) =>
    state.payments.filter(p => p.loanId === loanId), [state.payments])

  const getLoanById = useCallback((loanId: string) =>
    state.loans.find(l => l.id === loanId), [state.loans])

  return {
    loans: state.loans,
    payments: state.payments,
    selectedLoanId,
    setSelectedLoanId,
    isLoaded,
    addLoan,
    updateLoan,
    deleteLoan,
    addPayment,
    deletePayment,
    getPaymentsForLoan,
    getLoanById,
  }
}
