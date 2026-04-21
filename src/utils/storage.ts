import { STORAGE_KEY } from '@/constants'
import type { LoanStore } from '@/types'

const empty: LoanStore = { loans: [], payments: [] }

export function loadStore(): LoanStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    return JSON.parse(raw) as LoanStore
  } catch {
    return empty
  }
}

export function saveStore(store: LoanStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // quota exceeded or private browsing — fail silently
  }
}
