import { useState } from 'react'
import type { Loan } from '@/types'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

type Page = 'detail' | 'calculator'

interface AppShellProps {
  loans: Loan[]
  selectedLoanId: string | null
  activePage: Page
  householdId: string
  onSelectLoan: (id: string) => void
  onAddLoan: () => void
  onNavigate: (page: Page) => void
  children: React.ReactNode
}

export function AppShell({ loans, selectedLoanId, activePage, householdId, onSelectLoan, onAddLoan, onNavigate, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const selectedLoan = loans.find(l => l.id === selectedLoanId)
  const pageTitle = activePage === 'calculator' ? 'Payment Calculator' : (selectedLoan?.name ?? 'Loan Tracker')

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 flex-shrink-0 flex-col">
        <Sidebar
          loans={loans}
          selectedLoanId={selectedLoanId}
          activePage={activePage}
          householdId={householdId}
          onSelectLoan={onSelectLoan}
          onAddLoan={onAddLoan}
          onNavigate={onNavigate}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 z-50">
            <Sidebar
              loans={loans}
              selectedLoanId={selectedLoanId}
              activePage={activePage}
              householdId={householdId}
              onSelectLoan={onSelectLoan}
              onAddLoan={onAddLoan}
              onNavigate={onNavigate}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={pageTitle} onMenuClick={() => setSidebarOpen(true)} onAddLoan={onAddLoan} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
