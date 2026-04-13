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
import { Trash2, Pencil, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, GripVertical, Check, Maximize2, Minimize2 } from "lucide-react"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import ItineraryForm from "./ItineraryForm"
import SidebarItem from "./SidebarItem"
import FullscreenMode from "./FullscreenMode"
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
  onToggleComplete?: (id: string, completed: boolean) => void
  onReschedule?: (
    id: string,
    newStartTime: string,
    newEndTime: string,
    targetDate?: Date
  ) => Promise<void> | void
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  className?: string
  onSuccess?: () => void
}

export default function GridTimeline({
  items,
  onDeleteItem,
  onEditItem,
  onToggleComplete,
  onReschedule,
  selectedDate: externalSelectedDate,
  onDateChange,
  className,
  onSuccess,
}: GridTimelineProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Item | null>(null)
  const [dropTarget, setDropTarget] = useState<{
    time: string
    date: Date
  } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [internalDate, setInternalDate] = useState<Date>(new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Sheet state for slot click form
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [slotStartTime, setSlotStartTime] = useState("")
  const [slotEndTime, setSlotEndTime] = useState("")
  const [slotDate, setSlotDate] = useState<Date | null>(null)

  // Instant optimistic updates for seamless drag-drop (like Google Calendar)
  const [optimisticItem, setOptimisticItem] = useState<Item | null>(null)

  const selectedDate = externalSelectedDate || internalDate
  const setSelectedDate = onDateChange || setInternalDate

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  // Merge optimistic item with items for instant visual feedback
  const displayItems = useMemo(() => {
    if (!optimisticItem) return items
    return items.map((item) =>
      item.id === optimisticItem.id ? optimisticItem : item
    )
  }, [items, optimisticItem])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  // Slot click handler - opens drawer with pre-populated time
  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    let endHour = hour + 1
    let endMinute = minute
    if (endHour >= 24) {
      endHour = 23
      endMinute = 45
    }
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`

    setSlotStartTime(startTime)
    setSlotEndTime(endTime)
    setSlotDate(date)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSlotStartTime("")
    setSlotEndTime("")
    setSlotDate(null)
  }

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
      const item = items.find((i) => i.id === event.active.id)
      if (item) {
        setDraggedItem(item)
        setDropTarget(null)
        // Clear any previous optimistic state
        setOptimisticItem(null)
      }
    },
    [items]
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

      // Create optimistic item for INSTANT visual feedback
      const updatedItem: Item = {
        ...draggedItem,
        start: newStartTime,
        end: newEndTime,
        date: targetDate,
      }

      // Apply optimistic update IMMEDIATELY (synchronous)
      setOptimisticItem(updatedItem)

      // Fire mutation in background (non-blocking)
      onReschedule(draggedItem.id, newStartTime, newEndTime, targetDate)

      setDraggedItem(null)
      setDropTarget(null)
    },
    [
      draggedItem,
      onReschedule,
      selectedDate,
      viewMode,
    ]
  )

  const renderSidebar = () => {
    if (isMobile) return null

    const sidebarItems = displayItems
      .filter((item) => {
        if (!item.date) return false
        return isSameDay(item.date, selectedDate)
      })
      .sort((a, b) => a.start.localeCompare(b.start))

    const completedCount = sidebarItems.filter((item) => item.completed).length

    return (
      <div className="hidden w-72 shrink-0 border-r bg-gradient-to-b from-background to-muted/20 lg:block">
        <div className="p-0">
          <div className="rounded-none  p-3 ">
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
          <div className="min-h-72 space-y-2 overflow-y-auto pr-1">
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
                <SidebarItem
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
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
          {/* Mobile: Select dropdown */}
          <div className="lg:hidden flex items-center gap-2">
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
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              className="h-9 w-9"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Desktop: Button group */}
          <div className="hidden lg:flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
            <Button
              variant={viewMode === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("day")}
              className="h-7 text-xs"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="h-7 text-xs"
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="h-7 text-xs"
            >
              Month
            </Button>
          </div>
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
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      title="Edit item"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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
      <div
        ref={containerRef}
        className={cn(
          "flex h-full flex-col",
          className
        )}
      >
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

          <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
            <Button
              variant={viewMode === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("day")}
              className="h-8 text-xs"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="h-8 text-xs"
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="h-8 text-xs"
            >
              Month
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8 ml-2"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
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
                onToggleComplete={onToggleComplete}
                onSlotClick={handleSlotClick}
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
                onToggleComplete={onToggleComplete}
                onSlotClick={handleSlotClick}
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

      <DragOverlay className="z-50">
        {draggedItem ? (
          <div
            className={cn(
              "flex cursor-grabbing flex-col rounded-lg border p-2 shadow-lg",
              "scale-90 ring-1 ring-primary/30",
              draggedItem.categories?.length
                ? "border-white/30 shadow-xl"
                : draggedItem.itemType === "bucket-list"
                  ? "border-primary/30 bg-gradient-to-br from-primary to-primary/90"
                  : "border-border/60 bg-gradient-to-br from-muted to-muted/80"
            )}
            style={{
              background: draggedItem.categories?.length
                ? draggedItem.categories.length >= 2
                  ? `linear-gradient(135deg, ${draggedItem.categories[0].color} 0%, ${draggedItem.categories[1].color} 100%)`
                  : draggedItem.categories[0].color
                : undefined,
            }}
          >
            

            {/* Title - same style as TimelineEvent */}
            <h3 className={cn(
              "truncate font-semibold tracking-tight leading-tight text-xs",
              draggedItem.categories?.length
                ? "text-white drop-shadow-sm"
                : draggedItem.itemType === "bucket-list"
                  ? "text-primary-foreground"
                  : "text-foreground"
            )}>
              {draggedItem.title}
            </h3>

            {/* Time - same style as TimelineEvent */}
            {!dropTarget && (
              <div className={cn(
                "mt-0.5 flex items-center gap-1 text-[10px]",
                draggedItem.categories?.length
                  ? "text-white/90"
                  : draggedItem.itemType === "bucket-list"
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
              )}>
                <Clock className="h-2.5 w-2.5" />
                <span className="tabular-nums">{draggedItem.start} - {draggedItem.end}</span>
              </div>
            )}

            {/* Drop target preview badge - same style as event card info */}
            {dropTarget && (
              <div className={cn(
                "mb-1.5 flex flex-col ring-1 ring-primary/30 items-center -translate-x-[120%] -translate-y-1/2 justify-between rounded-md px-2 py-0.5 text-[10px] font-medium",
                draggedItem.categories?.length || draggedItem.itemType === "bucket-list"
                  ? "bg-black/30 text-white"
                  : ""
              )}>
                <div className="flex flex items-center gap-1">
                  <CalendarIcon className="h-2.5 w-2.5" />
                  <span>{format(dropTarget.date, "MMM d")}</span>
                </div>
                <div className="flex items-center gap-1 tabular-nums">
                  <span>{dropTarget.time}</span>
                  <span>→</span>
                  <span>
                    {minutesToTime(
                      timeToMinutes(dropTarget.time) + getDurationMinutes(draggedItem.start, draggedItem.end)
                    )}
                  </span>
                </div>
              </div>
            )}

            
          </div>
        ) : null}
      </DragOverlay>

      <FullscreenMode
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        displayItems={displayItems}
        onReschedule={onReschedule}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
        onToggleComplete={onToggleComplete}
        onSlotClick={handleSlotClick}
        isDrawerOpen={isDrawerOpen}
        onDrawerOpenChange={setIsDrawerOpen}
        onDrawerClose={handleDrawerClose}
        slotStartTime={slotStartTime}
        slotEndTime={slotEndTime}
        slotDate={slotDate}
        onSuccess={onSuccess}
      />

      {/* Sheet for Slot Click - Normal Mode */}
      <Sheet
        open={isDrawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleDrawerClose()
          }
          setIsDrawerOpen(open)
        }}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Itinerary Item</SheetTitle>
          </SheetHeader>
          <div className="flex justify-center px-4 pt-4 pb-4">
            <ItineraryForm
              className="mx-auto w-full"
              initialStartTime={slotStartTime}
              initialEndTime={slotEndTime}
              initialDate={slotDate}
              onSuccess={() => {
                handleDrawerClose()
                onSuccess?.()
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </DndContext>
  )
}
