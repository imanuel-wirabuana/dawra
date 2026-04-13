"use client"

import { Wallet, Search } from "lucide-react"
import { useGetExpenses, useExpensesByPeriod } from "@/features/expenses/hooks/useGetExpenses"
import { useExpenseFilters } from "@/features/expenses/hooks/useExpenseFilters"
import ExpenseSummary from "@/features/expenses/components/ExpenseSummary"
import ExpensePeriodView from "@/features/expenses/components/ExpensePeriodView"
import { ExpenseFilterSelector, PeriodViewSelector } from "@/features/expenses/components/ExpenseFilterSelector"
import ExpenseForm from "@/features/expenses/components/ExpenseForm"
import ExpenseSkeleton from "@/features/expenses/components/ExpenseSkeleton"
import { ExpenseSourceChart, ExpenseTrendChart } from "@/features/expenses/components/ExpenseCharts"
import { Input } from "@/components/ui/input"

export default function ExpensesPage() {
  const { expenses, total, isLoading } = useGetExpenses()
  const { filter, setFilter, searchQuery, setSearchQuery, periodView, setPeriodView } = useExpenseFilters()
  const periods = useExpensesByPeriod(periodView)

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Expenses
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Track your travel expenses. Itinerary costs are auto-tracked. Add custom expenses for other spending.
        </p>
      </div>

      {isLoading ? (
        <ExpenseSkeleton />
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Main Content */}
          <div className="order-2 w-full lg:order-1 lg:w-[65%]">
            {/* Summary Cards */}
            <ExpenseSummary expenses={expenses} total={total} className="mb-6" />

            {/* Filters, Period View & Search */}
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <ExpenseFilterSelector value={filter} onChange={setFilter} />
                <PeriodViewSelector value={periodView} onChange={setPeriodView} />
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Period Grouped Expense View */}
            <ExpensePeriodView
              periods={periods}
              filter={filter}
              searchQuery={searchQuery}
            />
          </div>

          {/* Sidebar */}
          <div className="order-1 w-full lg:order-2 lg:w-[35%]">
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* Add Expense Form */}
              <ExpenseForm />

              {/* Expense Breakdown Chart */}
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Expense Breakdown
                </h3>
                <ExpenseSourceChart expenses={expenses} />
              </div>

              {/* Trend Chart */}
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Spending Trend ({periodView})
                </h3>
                <ExpenseTrendChart periods={periods} />
              </div>

              {/* Quick Stats */}
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Overview
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium">{expenses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custom</span>
                    <span className="font-medium">
                      {expenses.filter((e) => e.expenseType === "custom").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From Itineraries</span>
                    <span className="font-medium">
                      {expenses.filter((e) => e.expenseType === "itinerary").length}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-medium">
                        Rp {total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
