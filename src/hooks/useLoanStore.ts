import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Loan, Payment, LoanStore } from '@/types'
import { getCurrentBalance } from '@/utils/financial'

export function useLoanStore(householdId: string) {
  const [store, setStore] = useState<LoanStore>({ loans: [], payments: [] })
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [firestoreError, setFirestoreError] = useState<string | null>(null)

  // Subscribe to Firestore — single source of truth
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true)
      setFirestoreError('Could not connect to Firestore. Check that Firestore Database is created in your Firebase project.')
    }, 8000)

    const unsub = onSnapshot(
      doc(db, 'households', householdId),
      (snap) => {
        clearTimeout(timeout)
        setFirestoreError(null)
        if (snap.exists()) {
          const data = snap.data() as LoanStore
          setStore(data)
          if (data.loans.length === 1) {
            setSelectedLoanId(id => id ?? data.loans[0].id)
          }
        }
        setIsLoaded(true)
      },
      (error) => {
        clearTimeout(timeout)
        setIsLoaded(true)
        setFirestoreError(`Firestore error: ${error.message}`)
      },
    )
    return () => { clearTimeout(timeout); unsub() }
  }, [householdId])

  // Optimistically update local state and persist to Firestore
  const save = useCallback((newStore: LoanStore) => {
    // JSON round-trip removes undefined values which Firestore rejects
    const clean: LoanStore = JSON.parse(JSON.stringify(newStore))
    setStore(clean)
    setDoc(doc(db, 'households', householdId), clean).catch(console.error)
  }, [householdId])

  const addLoan = useCallback((data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'>) => {
    const loan: Loan = {
      ...data,
      id: uuidv4(),
      currentBalance: data.principal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    save({ ...store, loans: [...store.loans, loan] })
    setSelectedLoanId(loan.id)
    return loan
  }, [store, save])

  const updateLoan = useCallback((loan: Loan) => {
    const updated = { ...loan, updatedAt: new Date().toISOString() }
    save({ ...store, loans: store.loans.map(l => l.id === updated.id ? updated : l) })
  }, [store, save])

  const deleteLoan = useCallback((loanId: string) => {
    save({
      loans: store.loans.filter(l => l.id !== loanId),
      payments: store.payments.filter(p => p.loanId !== loanId),
    })
    setSelectedLoanId(prev => prev === loanId ? null : prev)
  }, [store, save])

  const addPayment = useCallback((data: Omit<Payment, 'id' | 'createdAt'>) => {
    const payment: Payment = { ...data, id: uuidv4(), createdAt: new Date().toISOString() }
    const loan = store.loans.find(l => l.id === data.loanId)
    if (!loan) return payment
    const updatedPayments = [...store.payments.filter(p => p.loanId === data.loanId), payment]
    const newBalance = getCurrentBalance(loan, updatedPayments)
    const updatedLoan = { ...loan, currentBalance: newBalance, updatedAt: new Date().toISOString() }
    save({
      loans: store.loans.map(l => l.id === updatedLoan.id ? updatedLoan : l),
      payments: [...store.payments, payment],
    })
    return payment
  }, [store, save])

  const deletePayment = useCallback((paymentId: string) => {
    const payment = store.payments.find(p => p.id === paymentId)
    if (!payment) return
    const remaining = store.payments.filter(p => p.id !== paymentId)
    const loan = store.loans.find(l => l.id === payment.loanId)
    if (!loan) { save({ ...store, payments: remaining }); return }
    const paymentsForLoan = remaining.filter(p => p.loanId === loan.id)
    const newBalance = getCurrentBalance(loan, paymentsForLoan)
    const updatedLoan = { ...loan, currentBalance: newBalance, updatedAt: new Date().toISOString() }
    save({
      loans: store.loans.map(l => l.id === updatedLoan.id ? updatedLoan : l),
      payments: remaining,
    })
  }, [store, save])

  const getPaymentsForLoan = useCallback((loanId: string) =>
    store.payments.filter(p => p.loanId === loanId), [store.payments])

  const getLoanById = useCallback((loanId: string) =>
    store.loans.find(l => l.id === loanId), [store.loans])

  return {
    loans: store.loans,
    payments: store.payments,
    selectedLoanId,
    setSelectedLoanId,
    isLoaded,
    firestoreError,
    addLoan,
    updateLoan,
    deleteLoan,
    addPayment,
    deletePayment,
    getPaymentsForLoan,
    getLoanById,
  }
}
