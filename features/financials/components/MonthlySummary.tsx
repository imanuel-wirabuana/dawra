"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
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
      label: "Income",
      value: income,
      icon: TrendingUp,
      bgClass: "from-emerald-500/10 to-emerald-500/5",
      iconBgClass: "bg-emerald-500/20",
      textClass: "text-emerald-600 dark:text-emerald-400",
      iconClass: "text-emerald-600",
    },
    {
      label: "Expenses",
      value: expense,
      icon: TrendingDown,
      bgClass: "from-rose-500/10 to-rose-500/5",
      iconBgClass: "bg-rose-500/20",
      textClass: "text-rose-600 dark:text-rose-400",
      iconClass: "text-rose-600",
    },
    {
      label: "Balance",
      value: remaining,
      icon: Wallet,
      bgClass:
        remaining >= 0
          ? "from-blue-500/10 to-blue-500/5"
          : "from-rose-500/10 to-rose-500/5",
      iconBgClass: remaining >= 0 ? "bg-blue-500/20" : "bg-rose-500/20",
      textClass:
        remaining >= 0
          ? "text-blue-600 dark:text-blue-400"
          : "text-rose-600 dark:text-rose-400",
      iconClass: remaining >= 0 ? "text-blue-600" : "text-rose-600",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.label}
          className="overflow-hidden border-border/60 shadow-sm"
        >
          <CardContent className={cn("bg-linear-to-br p-5", item.bgClass)}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-bold tracking-tight",
                    item.textClass
                  )}
                >
                  {formatCurrency(item.value)}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  item.iconBgClass
                )}
              >
                <item.icon className={cn("h-5 w-5", item.iconClass)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
