"use client"

import { useItineraryStore } from "@/store/itineraryStore"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DatePicker() {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousDay}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-lg font-semibold",
          isToday(selectedDate) && "text-primary"
        )}>
          {formatDate(selectedDate)}
        </span>
        {!isToday(selectedDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="h-6 px-2 text-xs"
          >
            Today
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextDay}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
