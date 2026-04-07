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
import { format, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface DayGridProps {
  items: Item[]
  selectedDate: Date
  onReschedule?: (id: string, newStartTime: string, newEndTime: string) => void
  onEditItem?: (item: Item) => void
  onDeleteItem?: (id: string) => void
  draggedItemId: string | null
}

export default function DayGrid({
  items,
  selectedDate,
  onReschedule,
  onEditItem,
  onDeleteItem,
  draggedItemId,
}: DayGridProps) {
  const hours = generateHours()
  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT
  const isToday = isSameDay(selectedDate, new Date())

  const dayItems = items.filter((item) => {
    if (!item.date) return false
    return isSameDay(item.date, selectedDate)
  })

  const eventPositions = calculateEventPositions(dayItems)

  return (
    <div className="relative flex w-full overflow-auto border bg-background">
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
            "sticky top-0 z-10 h-8 border-b px-3 py-2 text-center",
            isToday ? "bg-primary/10" : "bg-muted/30"
          )}
        >
          <span className="text-sm font-medium">
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

          {onReschedule &&
            hours.map((hour) => (
              <div key={hour}>
                {[0, 15, 30, 45].map((minute) => (
                  <DroppableTimeSlot
                    key={`0-${hour}-${minute}`}
                    hour={parseInt(hour)}
                    minute={minute}
                    draggedItemId={draggedItemId}
                    dayIndex={0}
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
