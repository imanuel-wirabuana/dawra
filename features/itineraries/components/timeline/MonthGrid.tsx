"use client"

import { Item } from "./shared"
import {
  format,
  isSameDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday as isDateToday,
} from "date-fns"
import { cn } from "@/lib/utils"
import { Clock, CheckCircle2 } from "lucide-react"

interface MonthGridProps {
  items: Item[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  className?: string
}

export default function MonthGrid({
  items,
  selectedDate,
  onDateChange,
  className,
}: MonthGridProps) {
  const weekStartsOn = 1 // Monday
  const firstDayOfMonth = startOfMonth(selectedDate)
  const lastDayOfMonth = endOfMonth(selectedDate)
  const startOfCalendar = startOfWeek(firstDayOfMonth, { weekStartsOn })
  const endOfCalendar = endOfWeek(lastDayOfMonth, { weekStartsOn })
  const calendarDays = eachDayOfInterval({
    start: startOfCalendar,
    end: endOfCalendar,
  })

  // Group days into weeks
  const weeks: Date[][] = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  const weekDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const getItemsForDay = (day: Date) => {
    return items.filter((item) => {
      if (!item.date) return false
      return isSameDay(item.date, day)
    })
  }

  const completedCount = (day: Date) => {
    return getItemsForDay(day).filter((item) => item.completed).length
  }

  return (
    <div className={cn("flex h-full flex-col border bg-background rounded-lg overflow-hidden", className)}>
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {weekDayNames.map((name) => (
          <div
            key={name}
            className="py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((day) => {
              const dayItems = getItemsForDay(day)
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth()
              const isToday = isDateToday(day)
              const isSelected = isSameDay(day, selectedDate)
              const completed = completedCount(day)
              const total = dayItems.length

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[100px] cursor-pointer border-r last:border-r-0 p-2 transition-all duration-200",
                    !isCurrentMonth && "bg-muted/10 text-muted-foreground/60",
                    isCurrentMonth && "bg-background hover:bg-muted/30",
                    isSelected && "bg-primary/5 ring-2 ring-primary ring-inset relative z-10"
                  )}
                  onClick={() => onDateChange(day)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors",
                        isToday
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : isSelected
                            ? "bg-primary/15 text-primary"
                            : "text-foreground hover:bg-muted"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                    {total > 0 && (
                      <div className="flex items-center gap-1">
                        {completed === total && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        )}
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                          completed === total
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-primary/10 text-primary"
                        )}>
                          {completed}/{total}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] transition-colors",
                          item.itemType === "bucket-list"
                            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm"
                            : "bg-muted border border-border/50 text-muted-foreground",
                          item.completed && "opacity-50 grayscale"
                        )}
                      >
                        <Clock className="h-2.5 w-2.5 shrink-0 opacity-70" />
                        <span className="truncate font-medium">{item.title}</span>
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium px-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/50" />
                        +{dayItems.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
