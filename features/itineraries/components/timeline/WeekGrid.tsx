"use client"

import TimelineEvent from "../TimelineEvent"
import DroppableTimeSlot from "./DroppableTimeSlot"
import {
  Item,
  HOUR_HEIGHT,
  START_HOUR,
  END_HOUR,
  SIDEBAR_WIDTH,
  DAY_COL_WIDTH,
  generateHours,
  calculateEventPositions,
  timeToMinutes,
  getDurationMinutes,
} from "./shared"
import {
  format,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
} from "date-fns"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { CalendarDays } from "lucide-react"

interface WeekGridProps {
  items: Item[]
  selectedDate: Date
  onReschedule?: (id: string, newStartTime: string, newEndTime: string) => void
  onEditItem?: (item: Item) => void
  onDeleteItem?: (id: string) => void
  onToggleComplete?: (id: string, completed: boolean) => void
  onSlotClick?: (date: Date, hour: number, minute: number) => void
  onDateSelect?: (date: Date) => void
  draggedItemId: string | null
  className?: string
}

export default function WeekGrid({
  items,
  selectedDate,
  onReschedule,
  onEditItem,
  onDeleteItem,
  onToggleComplete,
  onSlotClick,
  onDateSelect,
  draggedItemId,
  className,
}: WeekGridProps) {
  const hours = generateHours()
  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [selectedDate])

  const getItemsForDay = (day: Date) => {
    return items.filter((item) => {
      if (!item.date) return false
      return isSameDay(item.date, day)
    })
  }

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

      {/* Days columns */}
      <div className="flex flex-1">
        {weekDays.map((day, dayIndex) => {
          const dayItems = getItemsForDay(day)
          const eventPositions = calculateEventPositions(dayItems)
          const isToday = isSameDay(day, new Date())
          const isSelected = isSameDay(day, selectedDate)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "relative border-r",
                isToday ? "bg-primary/5" : "bg-background",
                isSelected && "bg-primary/10"
              )}
              style={{ minWidth: DAY_COL_WIDTH, width: `${100 / 7}%` }}
            >
              <div
                onClick={() => onDateSelect?.(day)}
                className={cn(
                  "sticky top-0 z-10 h-10 border-b px-2 py-1.5 text-center transition-all duration-200 cursor-pointer hover:brightness-105",
                  isToday
                    ? "bg-gradient-to-b from-primary/15 to-primary/5 border-primary/20 hover:from-primary/20 hover:to-primary/10"
                    : "bg-gradient-to-b from-muted/50 to-muted/20 hover:from-muted/60 hover:to-muted/30",
                  isSelected && "bg-gradient-to-b from-primary/10 to-primary/5 ring-2 ring-primary ring-inset z-20"
                )}
                title="Click to view this day"
              >
                <div className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  isToday ? "text-primary" : "text-muted-foreground/70"
                )}>
                  {format(day, "EEE")}
                </div>
                <div className="flex items-center justify-center gap-1">
                  {isToday && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                  <div
                    className={cn(
                      "text-sm font-bold",
                      isToday && "text-primary",
                      isSelected && !isToday && "text-primary",
                      !isToday && !isSelected && "text-foreground/80"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              </div>

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
                          key={`${dayIndex}-${hour}-${minute}`}
                          hour={parseInt(hour)}
                          minute={minute}
                          draggedItemId={draggedItemId}
                          dayIndex={dayIndex}
                          onClick={
                            onSlotClick
                              ? (h, m) => onSlotClick(day, h, m)
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
                      className="absolute px-0.5"
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
                        compact={height < 40 || DAY_COL_WIDTH < 150}
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
          )
        })}
      </div>
    </div>
  )
}
