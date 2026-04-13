import { useQuery } from "@tanstack/react-query"
import {
  getExpenses,
  filterExpenses,
  groupExpensesByPeriod,
  getExpenseAmount,
  type ExpenseWithItineraryTitle,
} from "../services/get.service"
import type { ExpenseFilter, PeriodView, ExpensePeriodGroup } from "@/types"

interface UseExpensesResult {
  expenses: ExpenseWithItineraryTitle[]
  total: number
  isLoading: boolean
  isError: boolean
  error: Error | null
}

/**
 * Hook to fetch all expenses (custom + auto-generated from itineraries)
 */
export function useGetExpenses(): UseExpensesResult {
  const { data: expenses = [], isLoading, isError, error } = useQuery<ExpenseWithItineraryTitle[]>({
    queryKey: ["expenses"],
    queryFn: getExpenses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const total = expenses.reduce((sum, e) => sum + getExpenseAmount(e), 0)

  return {
    expenses,
    total,
    isLoading,
    isError,
    error,
  }
}

/**
 * Hook to get filtered expenses
 */
export function useFilteredExpenses(filter: ExpenseFilter): ExpenseWithItineraryTitle[] {
  const { expenses } = useGetExpenses()
  return filterExpenses(expenses, filter) as ExpenseWithItineraryTitle[]
}

/**
 * Hook to get expenses grouped by period (daily, weekly, monthly)
 */
export function useExpensesByPeriod(view: PeriodView): ExpensePeriodGroup[] {
  const { expenses } = useGetExpenses()
  return groupExpensesByPeriod(expenses, view)
}
