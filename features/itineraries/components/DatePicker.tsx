"use client"

import { useItineraryStore } from "@/store/itineraryStore"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isToday as isDateToday } from "date-fns"
import { useEffect, useCallback } from "react"

interface DatePickerProps {
  className?: string
}

export default function DatePicker({ className }: DatePickerProps) {
  const { selectedDate, setSelectedDate } = useItineraryStore()

  const goToYesterday = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))
  }

  const goToTomorrow = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))
  }

  const goToPreviousWeek = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))
  }

  const goToNextWeek = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // Keyboard navigation with arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        goToYesterday()
        break
      case "ArrowRight":
        e.preventDefault()
        goToTomorrow()
        break
      case "ArrowUp":
        e.preventDefault()
        goToPreviousWeek()
        break
      case "ArrowDown":
        e.preventDefault()
        goToNextWeek()
        break
    }
  }, [selectedDate])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

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
    <div className={cn("flex items-center gap-1", className)}>
      {/* Left - Yesterday */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToYesterday}
        className="h-7 w-7 hover:bg-background"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Center Column: Up, Date Display + Today, Down */}
      <div className="flex flex-col items-center">
        {/* Up - Previous Week */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousWeek}
          className="h-5 w-7 hover:bg-background"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>

        {/* Date Display with Today button */}
        <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2 py-0.5">
          
            <Button
              variant="ghost"
              onClick={goToToday}
              className="h-5 gap-1 px-1.5 text-[10px] font-medium hover:bg-background"
            >
              Today
            </Button>
          
        </div>

        {/* Down - Next Week */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextWeek}
          className="h-5 w-7 hover:bg-background"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Right - Tomorrow */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToTomorrow}
        className="h-7 w-7 hover:bg-background"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
