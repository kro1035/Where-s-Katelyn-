interface TopBarProps {
  title: string
  onMenuClick: () => void
  onAddLoan: () => void
}

export function TopBar({ title, onMenuClick, onAddLoan }: TopBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 lg:hidden">
      <button
        onClick={onMenuClick}
        className="text-slate-500 hover:text-slate-700 p-1 -ml-1 rounded-lg hover:bg-slate-100"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-semibold text-slate-900 text-sm truncate">{title}</span>
      </div>
      <button
        onClick={onAddLoan}
        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0"
        aria-label="Add loan"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Loan
      </button>
    </div>
  )
}
