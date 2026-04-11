"use client"

import { useItineraryStore } from "@/store/itineraryStore"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isToday as isDateToday } from "date-fns"

interface DatePickerProps {
  className?: string
}

export default function DatePicker({ className }: DatePickerProps) {
  const { selectedDate, setSelectedDate } = useItineraryStore()

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate)
    previousDay.setDate(previousDay.getDate() - 1)
    setSelectedDate(previousDay)
  }

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setSelectedDate(nextDay)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const isToday = isDateToday(selectedDate)
  const isTomorrow = format(selectedDate, "yyyy-MM-dd") === format(new Date(Date.now() + 86400000), "yyyy-MM-dd")
  const isYesterday = format(selectedDate, "yyyy-MM-dd") === format(new Date(Date.now() - 86400000), "yyyy-MM-dd")

  const getDisplayText = () => {
    if (isToday) return "Today"
    if (isTomorrow) return "Tomorrow"
    if (isYesterday) return "Yesterday"
    return format(selectedDate, "EEEE")
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousDay}
        className="h-8 w-8 rounded-lg border-border/60 bg-background hover:bg-muted hover:border-border transition-all duration-200"
      >
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </Button>

      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-4 py-1.5 shadow-sm">
        <CalendarDays className={cn(
          "h-4 w-4",
          isToday ? "text-primary" : "text-muted-foreground"
        )} />
        <div className="flex flex-col items-start leading-none">
          <span className={cn(
            "text-sm font-semibold",
            isToday && "text-primary"
          )}>
            {getDisplayText()}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">
            {format(selectedDate, "MMM d, yyyy")}
          </span>
        </div>
      </div>

      {!isToday && (
        <Button
          variant="ghost"
          size="sm"
          onClick={goToToday}
          className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
        >
          Today
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextDay}
        className="h-8 w-8 rounded-lg border-border/60 bg-background hover:bg-muted hover:border-border transition-all duration-200"
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  )
}
