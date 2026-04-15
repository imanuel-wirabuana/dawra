"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react"
import { formatCurrency } from "../utils/formatCurrency"
import { cn } from "@/lib/utils"

interface MonthlySummaryProps {
  income: number
  expense: number
  remaining: number
}

export function MonthlySummary({
  income,
  expense,
  remaining,
}: MonthlySummaryProps) {
  const items = [
    {
      label: "Total Income",
      value: income,
      icon: ArrowDownLeft,
      color: "emerald",
      bgClass:
        "from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10",
      textClass: "text-emerald-600 dark:text-emerald-400",
      iconClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Total Expense",
      value: expense,
      icon: ArrowUpRight,
      color: "rose",
      bgClass:
        "from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-900/10",
      textClass: "text-rose-600 dark:text-rose-400",
      iconClass: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Remaining",
      value: remaining,
      icon: Scale,
      color: remaining >= 0 ? "emerald" : "rose",
      bgClass:
        remaining >= 0
          ? "from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10"
          : "from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-900/10",
      textClass:
        remaining >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
      iconClass:
        remaining >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.label}
          className="overflow-hidden border-border/60 shadow-sm"
        >
          <CardContent className={cn("bg-linear-to-br p-4", item.bgClass)}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 shadow-sm">
                <item.icon className={cn("size-5", item.iconClass)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className={cn("truncate text-lg font-bold", item.textClass)}>
                  {formatCurrency(item.value)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
