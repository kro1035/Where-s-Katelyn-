import { EmptyState } from '@/components/ui/EmptyState'

interface HomePageProps {
  onAddLoan: () => void
}

export function HomePage({ onAddLoan }: HomePageProps) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <EmptyState
        icon={
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Track your loan payoff"
        description="Add your first loan to start tracking payments, viewing your progress, and calculating different payoff scenarios."
        action={{ label: 'Add Your First Loan', onClick: onAddLoan }}
      />
    </div>
  )
}
