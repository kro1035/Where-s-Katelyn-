import type { Loan } from '@/types'
import { formatCurrency } from '@/utils/formatting'
import { Button } from '@/components/ui/Button'

type Page = 'detail' | 'calculator'

interface SidebarProps {
  loans: Loan[]
  selectedLoanId: string | null
  activePage: Page
  onSelectLoan: (id: string) => void
  onAddLoan: () => void
  onNavigate: (page: Page) => void
  onClose?: () => void
}

export function Sidebar({ loans, selectedLoanId, activePage, onSelectLoan, onAddLoan, onNavigate, onClose }: SidebarProps) {
  const selectedLoan = loans.find(l => l.id === selectedLoanId)

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-semibold text-slate-900 text-sm">Loan Tracker</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 lg:hidden p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        {/* Loans section */}
        <div className="mb-1">
          <p className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">My Loans</p>
          <div className="space-y-0.5">
            {loans.map(loan => (
              <button
                key={loan.id}
                onClick={() => { onSelectLoan(loan.id); onNavigate('detail'); onClose?.() }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group ${
                  selectedLoanId === loan.id && activePage === 'detail'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">{loan.name}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-slate-500">{formatCurrency(loan.currentBalance)}</span>
                  <span className="text-xs text-slate-400">@ {loan.interestRate}%</span>
                </div>
              </button>
            ))}
            {loans.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400 italic">No loans yet</p>
            )}
          </div>
        </div>

        {/* Calculator link */}
        {selectedLoan && (
          <div className="mt-3">
            <p className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tools</p>
            <button
              onClick={() => { onNavigate('calculator'); onClose?.() }}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                activePage === 'calculator'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Payment Calculator</span>
            </button>
          </div>
        )}
      </nav>

      {/* Add Loan */}
      <div className="p-3 border-t border-slate-200">
        <Button variant="secondary" size="sm" className="w-full" onClick={onAddLoan}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Loan
        </Button>
      </div>
    </div>
  )
}
