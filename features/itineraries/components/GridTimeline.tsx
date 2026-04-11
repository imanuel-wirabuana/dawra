"use client"

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { Trash2, Pencil, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, GripVertical, Check } from "lucide-react"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  format,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  addMonths,
  subMonths,
} from "date-fns"

import DayGrid from "./timeline/DayGrid"
import WeekGrid from "./timeline/WeekGrid"
import MonthGrid from "./timeline/MonthGrid"
import {
  formatDuration,
  getDurationMinutes,
  minutesToTime,
  timeToMinutes,
  HOUR_HEIGHT,
  type Item,
  type ViewMode,
} from "./timeline/shared"
import DatePicker from "./DatePicker"

interface GridTimelineProps {
  items: Item[]
  onDeleteItem: (id: string) => void
  onEditItem?: (item: Item) => void
  onReschedule?: (
    id: string,
    newStartTime: string,
    newEndTime: string,
    targetDate?: Date
  ) => Promise<void> | void
  onSlotClick?: (date: Date, hour: number, minute: number) => void
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  debounceMs?: number
  className?: string
}

export default function GridTimeline({
  items,
  onDeleteItem,
  onEditItem,
  onReschedule,
  onSlotClick,
  selectedDate: externalSelectedDate,
  onDateChange,
  debounceMs = 300,
  className,
}: GridTimelineProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Item | null>(null)
  const [dropTarget, setDropTarget] = useState<{
    time: string
    date: Date
  } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [internalDate, setInternalDate] = useState<Date>(new Date())

  // Optimistic items state for smooth drag/drop visual feedback
  const [optimisticItems, setOptimisticItems] = useState<Map<string, Item>>(
    new Map()
  )
  const pendingUpdateRef = useRef<{
    id: string
    newStartTime: string
    newEndTime: string
    targetDate: Date
  } | null>(null)

  const selectedDate = externalSelectedDate || internalDate
  const setSelectedDate = onDateChange || setInternalDate

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  // Merge optimistic items with actual items for rendering
  const displayItems = useMemo(() => {
    if (optimisticItems.size === 0) return items

    return items.map((item) => {
      const optimistic = optimisticItems.get(item.id)
      return optimistic || item
    })
  }, [items, optimisticItems])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [selectedDate])

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === "day") {
      setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))
    } else if (viewMode === "week") {
      setSelectedDate(
        new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      )
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  const goToNext = () => {
    if (viewMode === "day") {
      setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))
    } else if (viewMode === "week") {
      setSelectedDate(
        new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      )
    } else {
      setSelectedDate(addMonths(selectedDate, 1))
    }
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const item = displayItems.find((i) => i.id === event.active.id)
      if (item) {
        setDraggedItem(item)
        setDropTarget(null)
      }
    },
    [displayItems]
  )

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (!over || !draggedItem) {
      setDropTarget(null)
      return
    }

    const hour = over.data.current?.hour as number
    const minute = over.data.current?.minute as number
    const dayIndex = over.data.current?.dayIndex as number

    if (hour === undefined || minute === undefined) {
      setDropTarget(null)
      return
    }

    const newStartMinutes = hour * 60 + minute
    const newStartTime = minutesToTime(newStartMinutes)

    // Calculate target date based on dayIndex (for week view cross-day drag)
    let targetDate = selectedDate
    if (viewMode === "week" && dayIndex !== undefined && dayIndex >= 0) {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
      targetDate = addDays(weekStart, dayIndex)
    }

    setDropTarget({ time: newStartTime, date: targetDate })
  }

  // Debounced reschedule handler for smooth background updates
  const {
    debouncedCallback: debouncedReschedule,
    cancel: cancelReschedule,
    flush: flushReschedule,
  } = useDebounce(
    async (
      id: string,
      newStartTime: string,
      newEndTime: string,
      targetDate: Date
    ) => {
      if (!onReschedule) return

      pendingUpdateRef.current = null
      await onReschedule(id, newStartTime, newEndTime, targetDate)
      // Clear optimistic item after successful update
      setOptimisticItems((prev) => {
        const next = new Map(prev)
        next.delete(id)
        return next
      })
    },
    debounceMs
  )

  // Flush any pending reschedule on unmount or when items change externally
  useEffect(() => {
    return () => {
      flushReschedule()
    }
  }, [flushReschedule])

  // Reset optimistic items when external items change
  useEffect(() => {
    setOptimisticItems(new Map())
    cancelReschedule()
    pendingUpdateRef.current = null
  }, [items, cancelReschedule])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (!over || !onReschedule || !draggedItem) {
        setDraggedItem(null)
        setDropTarget(null)
        return
      }

      const hour = over.data.current?.hour as number
      const minute = over.data.current?.minute as number
      const dayIndex = over.data.current?.dayIndex as number

      if (hour === undefined || minute === undefined) {
        setDraggedItem(null)
        setDropTarget(null)
        return
      }

      const newStartMinutes = hour * 60 + minute
      const duration = getDurationMinutes(draggedItem.start, draggedItem.end)
      const newEndMinutes = newStartMinutes + duration

      const newStartTime = minutesToTime(newStartMinutes)
      const newEndTime = minutesToTime(newEndMinutes)

      // Calculate target date based on dayIndex (for week view cross-day drag)
      let targetDate = selectedDate
      if (viewMode === "week" && dayIndex !== undefined && dayIndex >= 0) {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
        targetDate = addDays(weekStart, dayIndex)
      }

      // Cancel any pending previous reschedule
      cancelReschedule()

      // Store pending update reference
      pendingUpdateRef.current = {
        id: draggedItem.id,
        newStartTime,
        newEndTime,
        targetDate,
      }

      // Optimistically update the item position for immediate visual feedback
      const updatedItem: Item = {
        ...draggedItem,
        start: newStartTime,
        end: newEndTime,
        date: targetDate,
      }

      setOptimisticItems((prev) => {
        const next = new Map(prev)
        next.set(draggedItem.id, updatedItem)
        return next
      })

      // Trigger debounced background update
      debouncedReschedule(draggedItem.id, newStartTime, newEndTime, targetDate)

      setDraggedItem(null)
      setDropTarget(null)
    },
    [
      draggedItem,
      onReschedule,
      selectedDate,
      viewMode,
      debouncedReschedule,
      cancelReschedule,
    ]
  )

  const renderSidebar = () => {
    if (isMobile) return null

    const sidebarItems = displayItems.filter((item) => {
      if (!item.date) return false
      return isSameDay(item.date, selectedDate)
    })

    const completedCount = sidebarItems.filter((item) => item.completed).length

    return (
      <div className="hidden w-72 shrink-0 border-r bg-gradient-to-b from-background to-muted/20 lg:block">
        <div className="p-4">
          <div className="rounded-xl border border-border/50 bg-background p-3 shadow-sm">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md w-full"
            />
          </div>
        </div>

        <div className="border-t border-border/50 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              {format(selectedDate, "MMM d, yyyy")}
            </h3>
            {sidebarItems.length > 0 && (
              <span className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full",
                completedCount === sidebarItems.length
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-primary/10 text-primary"
              )}>
                {completedCount}/{sidebarItems.length}
              </span>
            )}
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {sidebarItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">No items</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">Add an item to get started</p>
              </div>
            ) : (
              sidebarItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2.5 text-xs transition-all duration-150 hover:shadow-sm",
                    item.itemType === "bucket-list"
                      ? "border-primary/20 bg-gradient-to-r from-primary/5 to-transparent"
                      : "border-border/50 bg-muted/30",
                    item.completed && "opacity-60 grayscale"
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase shadow-sm",
                      item.itemType === "bucket-list"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}
                  >
                    {item.itemType === "bucket-list" ? "BL" : "CS"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium truncate",
                      item.completed && "line-through"
                    )}>{item.title}</div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {item.start} - {item.end}
                    </div>
                  </div>
                  {item.completed && (
                    <div className="shrink-0 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  // Mobile layout
  if (isMobile) {
    const sortedItems = [...displayItems].sort((a, b) =>
      a.start.localeCompare(b.start)
    )

    return (
      <div className="space-y-4 p-4">
        {/* Mobile view switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {viewMode === "day" && format(selectedDate, "MMM d")}
              {viewMode === "week" &&
                `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d")}`}
              {viewMode === "month" && format(selectedDate, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sortedItems.map((item, index) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </div>
              {index < sortedItems.length - 1 && (
                <div className="mt-2 h-full w-0.5 bg-border" />
              )}
            </div>

            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.start} - {item.end}
                    <span className="ml-1 text-xs font-medium">
                      ({formatDuration(item.start, item.end)})
                    </span>
                  </p>
                  {item.location && (
                    <p className="text-sm text-muted-foreground">
                      {item.location}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  {item.itemType === "custom" && onEditItem && (
                    <button
                      onClick={() => onEditItem(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      title="Edit item"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {item.cost !== undefined && item.cost > 0 && (
                <p className="mt-1 text-sm">
                  <span className="text-muted-foreground">Cost: </span>
                  <span className="font-medium">
                    Rp {item.cost.toLocaleString("id-ID")}
                  </span>
                </p>
              )}
              {item.categories && item.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px]"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
              {item.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("flex h-full flex-col", className)}>
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
              <DatePicker/>
            </div>
            <div className="ml-2 flex flex-col">
              <span className="text-base font-semibold leading-tight">
                {viewMode === "day" && format(selectedDate, "EEEE, MMMM d, yyyy")}
                {viewMode === "week" &&
                  `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`}
                {viewMode === "month" && format(selectedDate, "MMMM yyyy")}
              </span>
              <span className="text-xs text-muted-foreground">
                {viewMode === "week" && `${weekDays.length} days selected`}
              </span>
            </div>
          </div>

          <Select
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <SelectTrigger className="w-28 h-9 bg-background border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {renderSidebar()}

          <div className="flex-1 overflow-auto">
            {viewMode === "day" && (
              <DayGrid
                items={displayItems}
                selectedDate={selectedDate}
                onReschedule={onReschedule}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
                onSlotClick={onSlotClick}
                draggedItemId={draggedItem?.id || null}
              />
            )}
            {viewMode === "week" && (
              <WeekGrid
                items={displayItems}
                selectedDate={selectedDate}
                onReschedule={onReschedule}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
                onSlotClick={onSlotClick}
                onDateSelect={(date) => {
                  setSelectedDate(date)
                }}
                draggedItemId={draggedItem?.id || null}
              />
            )}
            {viewMode === "month" && (
              <MonthGrid
                items={displayItems}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            )}
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {draggedItem ? (
          <div
            className={cn(
              "flex cursor-grabbing flex-col gap-1 rounded-lg border-2 p-2.5 shadow-xl ring-4 ring-primary/10 scale-105",
              draggedItem.itemType === "bucket-list"
                ? "border-primary bg-gradient-to-br from-primary to-primary/90"
                : "border-muted-foreground/30 bg-gradient-to-br from-muted to-muted/80"
            )}
            style={{
              width: "140px",
              height: `${(getDurationMinutes(draggedItem.start, draggedItem.end) / 60) * HOUR_HEIGHT}px`,
              minHeight: "50px",
            }}
          >
            {/* Drop target indicator */}
            {dropTarget && (
              <div className={cn(
                "mb-1 rounded-md px-2 py-1 text-[10px] font-semibold flex items-center gap-1",
                draggedItem.itemType === "bucket-list"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              )}>
                <Clock className="h-3 w-3" />
                {format(dropTarget.date, "MMM d")} @ {dropTarget.time}
              </div>
            )}
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase shadow-sm",
                  draggedItem.itemType === "bucket-list"
                    ? "bg-primary-foreground/25 text-primary-foreground"
                    : "bg-primary/20 text-primary"
                )}
              >
                {draggedItem.itemType === "bucket-list" ? "BL" : "CS"}
              </span>
              <h3
                className={cn(
                  "truncate text-xs font-bold",
                  draggedItem.itemType === "bucket-list"
                    ? "text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {draggedItem.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] opacity-90">
              <Clock className={cn(
                "h-3 w-3",
                draggedItem.itemType === "bucket-list"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )} />
              <span className={cn(
                "tabular-nums font-medium",
                draggedItem.itemType === "bucket-list"
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              )}>
                {draggedItem.start} - {draggedItem.end}
              </span>
            </div>
            {draggedItem.location && (
              <div className="flex items-center gap-1 text-[9px] opacity-80">
                <MapPin className={cn(
                  "h-2.5 w-2.5",
                  draggedItem.itemType === "bucket-list"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )} />
                <span className={cn(
                  "truncate",
                  draggedItem.itemType === "bucket-list"
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground/80"
                )}>
                  {draggedItem.location}
                </span>
              </div>
            )}
            <div className="mt-auto flex items-center justify-center opacity-30">
              <GripVertical className={cn(
                "h-4 w-4",
                draggedItem.itemType === "bucket-list"
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              )} />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
