"use client"

import type { ExpenseFilter } from "@/types"
import { cn } from "@/lib/utils"
import { FileText, Calendar, Wallet, StickyNote, Eye, EyeOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  filterExpenses,
  getExpenseAmount,
  getExpenseDate,
  getExpenseName,
  isExpenseIncluded,
  type ExpenseWithItineraryTitle,
} from "../services/get.service"
import { useToggleExpense } from "../hooks/useToggleExpense"

interface ExpenseListProps {
  expenses: ExpenseWithItineraryTitle[]
  filter: ExpenseFilter
  searchQuery: string
  className?: string
}

export default function ExpenseList({
  expenses,
  filter,
  searchQuery,
  className,
}: ExpenseListProps) {
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }

  const { mutate: toggleInclude, isPending: isToggling } = useToggleExpense()

  // Apply filter and search
  let filtered = filterExpenses(expenses, filter)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter((e) => {
      const name = getExpenseName(e).toLowerCase()
      const note = e.customExpense?.note?.toLowerCase() || ""
      return name.includes(query) || note.includes(query)
    })
  }

  if (filtered.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed py-12",
          className
        )}
      >
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Wallet className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No expenses found</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Add expenses manually or link itinerary items
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {filtered.map((expense) => {
        const name = getExpenseName(expense)
        const amount = getExpenseAmount(expense)
        const date = getExpenseDate(expense)
        const isCustom = expense.expenseType === "custom"
        const isIncluded = isExpenseIncluded(expense)

        return (
          <div
            key={expense.id}
            className={cn(
              "group relative flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200",
              "hover:border-primary/30 hover:shadow-md",
              !isIncluded && "opacity-60 bg-muted/30"
            )}
          >
            {/* Source Icon */}
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                isCustom
                  ? isIncluded
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-emerald-50 text-emerald-400"
                  : isIncluded
                    ? "bg-blue-100 text-blue-600"
                    : "bg-blue-50 text-blue-400"
              )}
            >
              {isIncluded ? (
                isCustom ? (
                  <FileText className="h-5 w-5" />
                ) : (
                  <Calendar className="h-5 w-5" />
                )
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={cn("font-medium truncate", !isIncluded && "line-through text-muted-foreground")}>
                {name}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {date && (
                  <span>{new Date(date).toLocaleDateString("id-ID")}</span>
                )}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-medium",
                    isCustom
                      ? isIncluded
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-emerald-50 text-emerald-400"
                      : isIncluded
                        ? "bg-blue-100 text-blue-700"
                        : "bg-blue-50 text-blue-400"
                  )}
                >
                  {isCustom ? "Custom" : "Itinerary"}
                </span>
                {!isIncluded && (
                  <span className="text-xs text-muted-foreground italic">
                    (excluded)
                  </span>
                )}
                {expense.customExpense?.category && isIncluded && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]"
                    style={{
                      borderColor: `${expense.customExpense.category.color}40`,
                      backgroundColor: `${expense.customExpense.category.color}15`,
                      color: expense.customExpense.category.color,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: expense.customExpense.category.color }}
                    />
                    {expense.customExpense.category.name}
                  </span>
                )}
              </div>

              {/* Note */}
              {expense.customExpense?.note && isIncluded && (
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <StickyNote className="h-3 w-3" />
                  <span className="truncate">{expense.customExpense.note}</span>
                </div>
              )}
            </div>

            {/* Toggle for all expenses */}
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={isIncluded}
                onCheckedChange={() => {
                  if (expense.id && !isToggling) {
                    toggleInclude({
                      expenseId: expense.id,
                      currentInclude: expense.include,
                      // Pass expense data for itinerary items (needed when creating override)
                      expenseData: !isCustom ? {
                        cachedAmount: expense.cachedAmount,
                        cachedDate: expense.cachedDate,
                      } : undefined,
                    })
                  }
                }}
                disabled={isToggling}
              />
            </div>

            {/* Amount */}
            <div className="text-right shrink-0 min-w-[100px]">
              <p className={cn("font-semibold", !isIncluded && "text-muted-foreground line-through")}>
                {formatCurrency(isIncluded ? amount : 0)}
              </p>
              {!isIncluded && (
                <p className="text-xs text-muted-foreground">
                  excluded
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
