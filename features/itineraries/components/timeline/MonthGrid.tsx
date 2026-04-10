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
} from "date-fns"
import { cn } from "@/lib/utils"

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

  return (
    <div className={cn("flex h-full flex-col border bg-background", className)}>
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekDayNames.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b">
            {week.map((day) => {
              const dayItems = getItemsForDay(day)
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth()
              const isToday = isSameDay(day, new Date())
              const isSelected = isSameDay(day, selectedDate)

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-24 cursor-pointer border-r p-1 transition-colors hover:bg-muted/50",
                    !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                    isSelected && "bg-primary/10 ring-1 ring-primary"
                  )}
                  onClick={() => onDateChange(day)}
                >
                  <div
                    className={cn(
                      "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : isSelected
                          ? "bg-primary/20 text-primary"
                          : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  <div className="space-y-1">
                    {dayItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "truncate rounded px-1 py-0.5 text-[10px]",
                          item.itemType === "bucket-list"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.start} {item.title}
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <div className="text-[10px] text-muted-foreground">
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
