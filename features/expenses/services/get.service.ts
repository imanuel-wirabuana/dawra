import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Expense, ExpenseFilter, ExpensePeriodGroup, PeriodView, ItineraryItem } from "@/types"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

const EXPENSES_COLLECTION = "expenses"
const ITINERARIES_COLLECTION = "itineraries"

/**
 * Extended expense type with cached itinerary title for display
 */
export type ExpenseWithItineraryTitle = Expense & {
  cachedItineraryTitle?: string
}

/**
 * Fetches all expenses - both custom expenses and auto-generated from itinerary items.
 * Itinerary items with costs are automatically included as expenses.
 */
export async function getExpenses(): Promise<ExpenseWithItineraryTitle[]> {
  const expenses: ExpenseWithItineraryTitle[] = []

  // 1. Fetch custom expenses from expenses collection
  const customExpensesSnapshot = await getDocs(collection(db, EXPENSES_COLLECTION))
  customExpensesSnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data() as Expense
    if (data.expenseType === "custom") {
      expenses.push({
        ...data,
        id: docSnapshot.id,
      })
    }
  })

  // 2. Auto-fetch itinerary items with costs and convert to expenses
  const itinerarySnapshot = await getDocs(collection(db, ITINERARIES_COLLECTION))
  itinerarySnapshot.forEach((docSnapshot) => {
    const itinerary = docSnapshot.data() as ItineraryItem
    
    // Only include custom itinerary items that have a cost
    if (itinerary.itemType === "custom" && itinerary.customItem?.cost && itinerary.customItem.cost > 0) {
      expenses.push({
        id: `it-${docSnapshot.id}`, // Prefix to avoid collision with custom expenses
        expenseType: "itinerary",
        itineraryId: docSnapshot.id,
        cachedAmount: itinerary.customItem.cost,
        cachedDate: itinerary.date,
        cachedItineraryTitle: itinerary.customItem.title,
      })
    }
  })

  // Sort by date descending (newest first)
  return expenses.sort((a, b) => {
    const dateA = a.customExpense?.date || a.cachedDate || ""
    const dateB = b.customExpense?.date || b.cachedDate || ""
    return dateB.localeCompare(dateA)
  })
}

/**
 * Checks if expense should be included in calculations (defaults to true)
 */
export function isExpenseIncluded(expense: Expense): boolean {
  return expense.include !== false // undefined defaults to true
}

/**
 * Gets the effective amount for an expense (handles both custom and itinerary types)
 * Returns 0 if expense is excluded (include: false)
 */
export function getExpenseAmount(expense: Expense): number {
  // Return 0 if expense is excluded
  if (expense.include === false) return 0

  if (expense.expenseType === "custom") {
    return expense.customExpense?.amount || 0
  }
  // For itinerary type, use cached amount
  return expense.cachedAmount || 0
}

/**
 * Gets the effective date for an expense
 */
export function getExpenseDate(expense: Expense): string {
  if (expense.expenseType === "custom") {
    return expense.customExpense?.date || ""
  }
  return expense.cachedDate || ""
}

/**
 * Gets the display name for an expense.
 * For itinerary expenses, uses cachedItineraryTitle if available.
 */
export function getExpenseName(expense: ExpenseWithItineraryTitle): string {
  if (expense.expenseType === "custom") {
    return expense.customExpense?.name || "Unnamed Expense"
  }
  return expense.cachedItineraryTitle || "Itinerary Expense"
}

/**
 * Filters expenses based on the selected filter
 */
export function filterExpenses(expenses: Expense[], filter: ExpenseFilter): Expense[] {
  switch (filter) {
    case "custom":
      return expenses.filter((e) => e.expenseType === "custom")
    case "itinerary":
      return expenses.filter((e) => e.expenseType === "itinerary")
    default:
      return expenses
  }
}

/**
 * Groups expenses by period (daily, weekly, monthly) and calculates totals
 */
export function groupExpensesByPeriod(
  expenses: Expense[],
  view: PeriodView
): ExpensePeriodGroup[] {
  const groups = new Map<string, ExpensePeriodGroup>()

  for (const expense of expenses) {
    const dateStr = getExpenseDate(expense)
    if (!dateStr) continue

    const date = new Date(dateStr)
    let periodKey: string
    let label: string
    let startDate: Date
    let endDate: Date

    switch (view) {
      case "daily":
        periodKey = format(date, "yyyy-MM-dd")
        label = format(date, "EEEE, MMM d, yyyy")
        startDate = date
        endDate = date
        break
      case "weekly":
        startDate = startOfWeek(date, { weekStartsOn: 1 })
        endDate = endOfWeek(date, { weekStartsOn: 1 })
        periodKey = format(startDate, "yyyy-MM-dd")
        label = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`
        break
      case "monthly":
        startDate = startOfMonth(date)
        endDate = endOfMonth(date)
        periodKey = format(date, "yyyy-MM")
        label = format(date, "MMMM yyyy")
        break
    }

    if (!groups.has(periodKey)) {
      groups.set(periodKey, {
        periodKey,
        label,
        startDate,
        endDate,
        total: 0,
        count: 0,
        expenses: [],
      })
    }

    const group = groups.get(periodKey)!
    group.total += getExpenseAmount(expense)
    group.count += 1
    group.expenses.push(expense)
  }

  // Sort by date descending
  return Array.from(groups.values()).sort(
    (a, b) => b.startDate.getTime() - a.startDate.getTime()
  )
}

/**
 * Calculates total for a specific period view
 */
export function calculatePeriodTotal(expenses: Expense[], view: PeriodView): number {
  return expenses.reduce((sum, e) => sum + getExpenseAmount(e), 0)
}
