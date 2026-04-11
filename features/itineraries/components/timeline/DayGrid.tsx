"use client"

import TimelineEvent from "../TimelineEvent"
import DroppableTimeSlot from "./DroppableTimeSlot"
import {
  Item,
  HOUR_HEIGHT,
  START_HOUR,
  END_HOUR,
  SIDEBAR_WIDTH,
  generateHours,
  calculateEventPositions,
  timeToMinutes,
  getDurationMinutes,
} from "./shared"
import { format, isSameDay, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarDays } from "lucide-react"

interface DayGridProps {
  items: Item[]
  selectedDate: Date
  onReschedule?: (id: string, newStartTime: string, newEndTime: string) => void
  onEditItem?: (item: Item) => void
  onDeleteItem?: (id: string) => void
  onToggleComplete?: (id: string, completed: boolean) => void
  onSlotClick?: (date: Date, hour: number, minute: number) => void
  draggedItemId: string | null
  className?: string
}

export default function DayGrid({
  items,
  selectedDate,
  onReschedule,
  onEditItem,
  onDeleteItem,
  onToggleComplete,
  onSlotClick,
  draggedItemId,
  className,
}: DayGridProps) {
  const hours = generateHours()
  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT
  const isSelectedToday = isSameDay(selectedDate, new Date())

  const dayItems = items.filter((item) => {
    if (!item.date) return false
    return isSameDay(item.date, selectedDate)
  })

  const eventPositions = calculateEventPositions(dayItems)

  return (
    <div
      className={cn(
        "relative flex w-full overflow-auto border bg-background",
        className
      )}
    >
      {/* Time sidebar */}
      <div
        className="sticky left-0 z-20 shrink-0 border-r bg-background"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div className="h-8 border-b bg-muted/30" />
        <div style={{ height: totalHeight }}>
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative border-b border-muted-foreground/20"
              style={{ height: HOUR_HEIGHT }}
            >
              <span className="absolute -top-2 right-2 text-xs text-muted-foreground">
                {hour}:00
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Day column */}
      <div className="relative flex-1">
        {/* Header */}
        <div
          className={cn(
            "sticky top-0 z-10 h-10 border-b px-3 py-2 flex items-center justify-center gap-2",
            isSelectedToday
              ? "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20"
              : "bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40"
          )}
        >
          {isSelectedToday && (
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
          <CalendarDays className={cn(
            "h-4 w-4",
            isSelectedToday ? "text-primary" : "text-muted-foreground/60"
          )} />
          <span className={cn(
            "text-sm font-semibold",
            isSelectedToday && "text-primary"
          )}>
            {format(selectedDate, "EEEE, MMMM d")}
          </span>
        </div>

        {/* Grid */}
        <div className="relative" style={{ height: totalHeight }}>
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute w-full border-b border-muted-foreground/10"
              style={{
                top: `${(parseInt(hour) - START_HOUR) * HOUR_HEIGHT}px`,
                height: HOUR_HEIGHT,
              }}
            />
          ))}

          {(onReschedule || onSlotClick) &&
            hours.map((hour) => (
              <div key={hour}>
                {[0, 15, 30, 45].map((minute) => (
                  <DroppableTimeSlot
                    key={`0-${hour}-${minute}`}
                    hour={parseInt(hour)}
                    minute={minute}
                    draggedItemId={draggedItemId}
                    dayIndex={0}
                    onClick={
                      onSlotClick
                        ? (h, m) => onSlotClick(selectedDate, h, m)
                        : undefined
                    }
                  />
                ))}
              </div>
            ))}

          {dayItems.map((item) => {
            const pos = eventPositions.get(item.id)
            if (!pos) return null

            const startMinutes = timeToMinutes(item.start)
            const duration = getDurationMinutes(item.start, item.end)
            const top = (startMinutes / 60 - START_HOUR) * HOUR_HEIGHT
            const height = (duration / 60) * HOUR_HEIGHT

            const columnWidth =
              pos.totalColumns > 1 ? 100 / pos.totalColumns : 100
            const leftPercent = pos.column * columnWidth

            return (
              <div
                key={item.id}
                className="absolute px-1"
                style={{
                  top: `${top}px`,
                  height: `${Math.max(height - 2, 20)}px`,
                  left: `${leftPercent}%`,
                  width: `${columnWidth}%`,
                }}
              >
                <TimelineEvent
                  item={item}
                  draggable={!!onReschedule}
                  compact={height < 40}
                  onEdit={onEditItem ? () => onEditItem(item) : undefined}
                  onDelete={
                    onDeleteItem ? () => onDeleteItem(item.id) : undefined
                  }
                  onToggleComplete={onToggleComplete}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
