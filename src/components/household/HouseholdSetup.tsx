import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const HOUSEHOLD_KEY = 'loan-tracker-household-id'

interface HouseholdSetupProps {
  onReady: (householdId: string) => void
}

export function HouseholdSetup({ onReady }: HouseholdSetupProps) {
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')

  function handleCreate() {
    const id = uuidv4()
    localStorage.setItem(HOUSEHOLD_KEY, id)
    onReady(id)
  }

  function handleJoin() {
    const trimmed = joinCode.trim()
    if (!trimmed) { setError('Enter a household code'); return }
    localStorage.setItem(HOUSEHOLD_KEY, trimmed)
    onReady(trimmed)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Loan Tracker</h1>
        <p className="text-sm text-slate-500 text-center mb-8">Sync data across devices with your partner</p>

        <div className="space-y-6">
          {/* Create new */}
          <div className="border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-1">New household</h2>
            <p className="text-xs text-slate-500 mb-4">Start fresh and get a code to share with your partner.</p>
            <Button className="w-full" onClick={handleCreate}>
              Create Household
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Join existing */}
          <div className="border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-1">Join existing household</h2>
            <p className="text-xs text-slate-500 mb-4">Enter the code shared by your partner.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Paste household code..."
                value={joinCode}
                onChange={e => { setJoinCode(e.target.value); setError('') }}
                error={error}
                className="font-mono text-xs"
              />
              <Button variant="secondary" onClick={handleJoin} className="flex-shrink-0">
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function getStoredHouseholdId(): string | null {
  return localStorage.getItem(HOUSEHOLD_KEY)
}

export function clearHouseholdId(): void {
  localStorage.removeItem(HOUSEHOLD_KEY)
}
