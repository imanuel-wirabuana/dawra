import { useState } from "react"
import type { ExpenseFilter, PeriodView } from "@/types"

/**
 * Hook to manage expense filter and view state
 */
export function useExpenseFilters() {
  const [filter, setFilter] = useState<ExpenseFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [periodView, setPeriodView] = useState<PeriodView>("daily")

  return {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    periodView,
    setPeriodView,
  }
}
