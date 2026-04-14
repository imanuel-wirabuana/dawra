"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useItineraryStore } from "@/store/itineraryStore"

interface DatePickerProps {
  className?: string
}

export default function DatePicker({ className }: DatePickerProps) {
  const { selectedDate, setSelectedDate } = useItineraryStore()

  // Track which arrow keys are currently pressed for visual feedback
  const [pressedKey, setPressedKey] = useState<string | null>(null)

  // Ensure selectedDate is a valid Date object
  const safeSelectedDate = useMemo(
    () =>
      selectedDate instanceof Date ? selectedDate : new Date(selectedDate),
    [selectedDate]
  )

  const goToYesterday = () => {
    setSelectedDate(new Date(safeSelectedDate.getTime() - 24 * 60 * 60 * 1000))
  }

  const goToTomorrow = () => {
    setSelectedDate(new Date(safeSelectedDate.getTime() + 24 * 60 * 60 * 1000))
  }

  const goToPreviousWeek = () => {
    setSelectedDate(
      new Date(safeSelectedDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    )
  }

  const goToNextWeek = () => {
    setSelectedDate(
      new Date(safeSelectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    )
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // Keyboard navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          setPressedKey("ArrowLeft")
          setSelectedDate(
            new Date(safeSelectedDate.getTime() - 24 * 60 * 60 * 1000)
          )
          break
        case "ArrowRight":
          e.preventDefault()
          setPressedKey("ArrowRight")
          setSelectedDate(
            new Date(safeSelectedDate.getTime() + 24 * 60 * 60 * 1000)
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setPressedKey("ArrowUp")
          setSelectedDate(
            new Date(safeSelectedDate.getTime() - 7 * 24 * 60 * 60 * 1000)
          )
          break
        case "ArrowDown":
          e.preventDefault()
          setPressedKey("ArrowDown")
          setSelectedDate(
            new Date(safeSelectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
          )
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        setPressedKey(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [safeSelectedDate, setSelectedDate])

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Left - Yesterday */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToYesterday}
        className={cn(
          "h-7 w-7 transition-all duration-150 hover:bg-background",
          pressedKey === "ArrowLeft" && "scale-110 bg-primary/20 text-primary"
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
            "h-5 w-7 transition-all duration-150 hover:bg-background",
            pressedKey === "ArrowUp" && "scale-110 bg-primary/20 text-primary"
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
            "h-5 w-7 transition-all duration-150 hover:bg-background",
            pressedKey === "ArrowDown" && "scale-110 bg-primary/20 text-primary"
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
          "h-7 w-7 transition-all duration-150 hover:bg-background",
          pressedKey === "ArrowRight" && "scale-110 bg-primary/20 text-primary"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
