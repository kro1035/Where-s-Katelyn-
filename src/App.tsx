import { useState } from 'react'
import { useLoanStore } from '@/hooks/useLoanStore'
import { useLedger } from '@/hooks/useLedger'
import { AppShell } from '@/components/layout/AppShell'
import { LoanForm } from '@/components/loans/LoanForm'
import { HouseholdSetup, getStoredHouseholdId } from '@/components/household/HouseholdSetup'
import { HomePage } from '@/pages/HomePage'
import { LoanDetailPage } from '@/pages/LoanDetailPage'
import { CalculatorPage } from '@/pages/CalculatorPage'
import { SchedulePage } from '@/pages/SchedulePage'
import type { Loan } from '@/types'

type Page = 'detail' | 'calculator' | 'schedule'

function LoanDetail({ loanId, store }: { loanId: string; store: ReturnType<typeof useLoanStore> }) {
  const loan = store.getLoanById(loanId)!
  const payments = store.getPaymentsForLoan(loanId)
  const ledger = useLedger(loan, payments)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <LoanDetailPage
        loan={loan}
        ledger={ledger}
        onAddPayment={store.addPayment}
        onDeletePayment={store.deletePayment}
        onEditLoan={() => setEditOpen(true)}
      />
      <LoanForm
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={data => store.updateLoan({ ...loan, ...data })}
        initialValues={loan}
      />
    </>
  )
}

function LoanCalculator({ loanId, store }: { loanId: string; store: ReturnType<typeof useLoanStore> }) {
  const loan = store.getLoanById(loanId)!
  const payments = store.getPaymentsForLoan(loanId)
  const ledger = useLedger(loan, payments)
  return <CalculatorPage loan={loan} ledger={ledger} />
}

function TrackerApp({ householdId }: { householdId: string }) {
  const store = useLoanStore(householdId)
  const [activePage, setActivePage] = useState<Page>('schedule')
  const [addOpen, setAddOpen] = useState(false)

  function handleAddLoan(data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'>) {
    store.addLoan(data)
    setActivePage('detail')
  }

  function renderMain() {
    if (activePage === 'schedule') {
      return <SchedulePage />
    }
    if (store.firestoreError) {
      return (
        <div className="p-6 max-w-lg">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-rose-800 mb-1">Firestore not connected</p>
            <p className="text-sm text-rose-700 mb-3">{store.firestoreError}</p>
            <ol className="text-sm text-rose-700 list-decimal list-inside space-y-1">
              <li>Go to your <strong>Firebase Console</strong></li>
              <li>Select your project → <strong>Build → Firestore Database</strong></li>
              <li>Click <strong>Create database</strong> and choose <strong>Start in test mode</strong></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      )
    }
    if (!store.isLoaded) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Connecting to Firestore…</span>
          </div>
        </div>
      )
    }
    if (!store.selectedLoanId || !store.getLoanById(store.selectedLoanId)) {
      return <HomePage onAddLoan={() => setAddOpen(true)} />
    }
    if (activePage === 'calculator') {
      return <LoanCalculator loanId={store.selectedLoanId} store={store} />
    }
    return <LoanDetail loanId={store.selectedLoanId} store={store} />
  }

  return (
    <>
      <AppShell
        loans={store.loans}
        selectedLoanId={store.selectedLoanId}
        activePage={activePage}
        householdId={householdId}
        onSelectLoan={id => { store.setSelectedLoanId(id); setActivePage('detail') }}
        onAddLoan={() => setAddOpen(true)}
        onNavigate={setActivePage}
      >
        {renderMain()}
      </AppShell>
      <LoanForm
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddLoan}
      />
    </>
  )
}

export default function App() {
  const [householdId, setHouseholdId] = useState<string | null>(getStoredHouseholdId)

  if (!householdId) {
    return <HouseholdSetup onReady={setHouseholdId} />
  }

  return <TrackerApp householdId={householdId} />
}
