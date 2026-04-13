"use client"

import type { ExpenseFilter, PeriodView } from "@/types"
import { cn } from "@/lib/utils"
import { Wallet, FileText, Calendar, CalendarDays, CalendarRange } from "lucide-react"

interface ExpenseFilterSelectorProps {
  value: ExpenseFilter
  onChange: (filter: ExpenseFilter) => void
  className?: string
}

const filters: { value: ExpenseFilter; label: string; icon: typeof Wallet }[] = [
  { value: "all", label: "All", icon: Wallet },
  { value: "custom", label: "Custom", icon: FileText },
  { value: "itinerary", label: "Itineraries", icon: Calendar },
]

export function ExpenseFilterSelector({
  value,
  onChange,
  className,
}: ExpenseFilterSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
            value === filter.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          <filter.icon className="h-4 w-4" />
          {filter.label}
        </button>
      ))}
    </div>
  )
}

interface PeriodViewSelectorProps {
  value: PeriodView
  onChange: (view: PeriodView) => void
  className?: string
}

const views: { value: PeriodView; label: string; icon: typeof Wallet }[] = [
  { value: "daily", label: "Daily", icon: CalendarDays },
  { value: "weekly", label: "Weekly", icon: CalendarRange },
  { value: "monthly", label: "Monthly", icon: Calendar },
]

export function PeriodViewSelector({
  value,
  onChange,
  className,
}: PeriodViewSelectorProps) {
  return (
    <div className={cn("flex gap-1 rounded-lg border bg-muted/50 p-1", className)}>
      {views.map((view) => (
        <button
          key={view.value}
          onClick={() => onChange(view.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
            value === view.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}
