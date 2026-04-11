"use client"

import { useItineraryStore } from "@/store/itineraryStore"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isToday as isDateToday } from "date-fns"
import { useEffect, useCallback, useState } from "react"

interface DatePickerProps {
  className?: string
}

export default function DatePicker({ className }: DatePickerProps) {
  const { selectedDate, setSelectedDate } = useItineraryStore()

  // Track which arrow keys are currently pressed for visual feedback
  const [pressedKey, setPressedKey] = useState<string | null>(null)

  // Ensure selectedDate is a valid Date object
  const safeSelectedDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate)

  const goToYesterday = () => {
    setSelectedDate(new Date(safeSelectedDate.getTime() - 24 * 60 * 60 * 1000))
  }

  const goToTomorrow = () => {
    setSelectedDate(new Date(safeSelectedDate.getTime() + 24 * 60 * 60 * 1000))
  }

  const goToPreviousWeek = () => {
    setSelectedDate(new Date(safeSelectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))
  }

  const goToNextWeek = () => {
    setSelectedDate(new Date(safeSelectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // Keyboard navigation with arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        setPressedKey("ArrowLeft")
        goToYesterday()
        break
      case "ArrowRight":
        e.preventDefault()
        setPressedKey("ArrowRight")
        goToTomorrow()
        break
      case "ArrowUp":
        e.preventDefault()
        setPressedKey("ArrowUp")
        goToPreviousWeek()
        break
      case "ArrowDown":
        e.preventDefault()
        setPressedKey("ArrowDown")
        goToNextWeek()
        break
    }
  }, [safeSelectedDate])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      setPressedKey(null)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  const isToday = isDateToday(safeSelectedDate)
  const isTomorrow = format(safeSelectedDate, "yyyy-MM-dd") === format(new Date(Date.now() + 86400000), "yyyy-MM-dd")
  const isYesterday = format(safeSelectedDate, "yyyy-MM-dd") === format(new Date(Date.now() - 86400000), "yyyy-MM-dd")

  const getDisplayText = () => {
    if (isToday) return "Today"
    if (isTomorrow) return "Tomorrow"
    if (isYesterday) return "Yesterday"
    return format(safeSelectedDate, "EEEE")
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Left - Yesterday */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToYesterday}
        className={cn(
          "h-7 w-7 hover:bg-background transition-all duration-150",
          pressedKey === "ArrowLeft" && "bg-primary/20 text-primary scale-110"
        )}
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
          className={cn(
            "h-5 w-7 hover:bg-background transition-all duration-150",
            pressedKey === "ArrowUp" && "bg-primary/20 text-primary scale-110"
          )}
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
          className={cn(
            "h-5 w-7 hover:bg-background transition-all duration-150",
            pressedKey === "ArrowDown" && "bg-primary/20 text-primary scale-110"
          )}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Right - Tomorrow */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToTomorrow}
        className={cn(
          "h-7 w-7 hover:bg-background transition-all duration-150",
          pressedKey === "ArrowRight" && "bg-primary/20 text-primary scale-110"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
