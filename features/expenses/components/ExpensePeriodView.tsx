"use client"

import type { ExpensePeriodGroup, ExpenseFilter } from "@/types"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Wallet } from "lucide-react"
import { useState } from "react"
import ExpenseList from "./ExpenseList"

interface ExpensePeriodViewProps {
  periods: ExpensePeriodGroup[]
  filter: ExpenseFilter
  searchQuery: string
  className?: string
}

export default function ExpensePeriodView({
  periods,
  filter,
  searchQuery,
  className,
}: ExpensePeriodViewProps) {
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }

  const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(
    () => new Set(periods.map((p) => p.periodKey))
  )

  const togglePeriod = (periodKey: string) => {
    const newSet = new Set(expandedPeriods)
    if (newSet.has(periodKey)) {
      newSet.delete(periodKey)
    } else {
      newSet.add(periodKey)
    }
    setExpandedPeriods(newSet)
  }

  if (periods.length === 0) {
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
          Add expenses to see them grouped by period
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {periods.map((period) => {
        const isExpanded = expandedPeriods.has(period.periodKey)

        return (
          <div
            key={period.periodKey}
            className="rounded-xl border bg-card overflow-hidden"
          >
            {/* Period Header */}
            <button
              onClick={() => togglePeriod(period.periodKey)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <h3 className="font-medium">{period.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {period.count} expense{period.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(period.total)}</p>
              </div>
            </button>

            {/* Period Expenses */}
            {isExpanded && (
              <div className="border-t px-4 py-3">
                <ExpenseList
                  expenses={period.expenses}
                  filter={filter}
                  searchQuery={searchQuery}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
