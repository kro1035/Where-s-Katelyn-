import { useState } from 'react'
import { useLoanStore } from '@/hooks/useLoanStore'
import { useLedger } from '@/hooks/useLedger'
import { AppShell } from '@/components/layout/AppShell'
import { LoanForm } from '@/components/loans/LoanForm'
import { HomePage } from '@/pages/HomePage'
import { LoanDetailPage } from '@/pages/LoanDetailPage'
import { CalculatorPage } from '@/pages/CalculatorPage'
import type { Loan } from '@/types'

type Page = 'detail' | 'calculator'

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

export default function App() {
  const store = useLoanStore()
  const [activePage, setActivePage] = useState<Page>('detail')
  const [addOpen, setAddOpen] = useState(false)

  function handleAddLoan(data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'>) {
    store.addLoan(data)
    setActivePage('detail')
  }

  function renderMain() {
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
