"use client"

import { Wallet, FileText, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { getExpenseAmount, type ExpenseWithItineraryTitle } from "../services/get.service"

interface ExpenseSummaryProps {
  expenses: ExpenseWithItineraryTitle[]
  total: number
  className?: string
}

export default function ExpenseSummary({ expenses, total, className }: ExpenseSummaryProps) {
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`
  }

  const customCount = expenses.filter((e) => e.expenseType === "custom").length
  const itineraryCount = expenses.filter((e) => e.expenseType === "itinerary").length

  const customTotal = expenses
    .filter((e) => e.expenseType === "custom")
    .reduce((sum, e) => sum + getExpenseAmount(e), 0)

  const itineraryTotal = expenses
    .filter((e) => e.expenseType === "itinerary")
    .reduce((sum, e) => sum + getExpenseAmount(e), 0)

  const stats = [
    {
      label: "Total Expenses",
      value: formatCurrency(total),
      count: expenses.length,
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Custom",
      value: formatCurrency(customTotal),
      count: customCount,
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "From Itineraries",
      value: formatCurrency(itineraryTotal),
      count: itineraryCount,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={cn("rounded-lg p-2", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-semibold tracking-tight">{stat.value}</p>
              {stat.count !== undefined && (
                <p className="text-xs text-muted-foreground">
                  {stat.count} item{stat.count !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
