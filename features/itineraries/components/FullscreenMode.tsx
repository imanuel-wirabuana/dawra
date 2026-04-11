"use client"

import { Maximize2, Minimize2 } from "lucide-react"
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { useMemo, useEffect, useState } from "react"
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { ViewMode, Item } from "./timeline/shared"
import DayGrid from "./timeline/DayGrid"
import WeekGrid from "./timeline/WeekGrid"
import MonthGrid from "./timeline/MonthGrid"
import ItineraryForm from "./ItineraryForm"
import DatePicker from "./DatePicker"
import SidebarItem from "./SidebarItem"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, Clock, MapPin, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface FullscreenModeProps {
  isOpen: boolean
  onClose: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedDate: Date
  onDateChange: (date: Date) => void
  displayItems: Item[]
  onReschedule?: (
    id: string,
    newStartTime: string,
    newEndTime: string,
    targetDate?: Date
  ) => Promise<void> | void
  onEditItem?: (item: Item) => void
  onDeleteItem: (id: string) => void
  onToggleComplete?: (id: string, completed: boolean) => void
  onSlotClick: (date: Date, hour: number, minute: number) => void
  isDrawerOpen: boolean
  onDrawerOpenChange: (open: boolean) => void
  onDrawerClose: () => void
  slotStartTime: string
  slotEndTime: string
  slotDate: Date | null
  onSuccess?: () => void
}

export default function FullscreenMode({
  isOpen,
  onClose,
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange,
  displayItems,
  onReschedule,
  onEditItem,
  onDeleteItem,
  onToggleComplete,
  onSlotClick,
  isDrawerOpen,
  onDrawerOpenChange,
  onDrawerClose,
  slotStartTime,
  slotEndTime,
  slotDate,
  onSuccess,
}: FullscreenModeProps) {
  const [draggedItem, setDraggedItem] = useState<Item | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [selectedDate])

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const handleDragStart = (event: DragStartEvent) => {
    const item = displayItems.find((i) => i.id === event.active.id)
    if (item) {
      setDraggedItem(item)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedItem(null)

    if (!over || !onReschedule) return

    const itemId = active.id as string
    const overData = over.data.current as {
      time?: string
      date?: Date
      dayIndex?: number
    } | null

    if (!overData?.time || !overData?.date) return

    const item = displayItems.find((i) => i.id === itemId)
    if (!item) return

    const newStartTime = overData.time
    const durationMinutes =
      parseInt(item.end.split(":")[0]) * 60 +
      parseInt(item.end.split(":")[1]) -
      (parseInt(item.start.split(":")[0]) * 60 + parseInt(item.start.split(":")[1]))

    const [newStartH, newStartM] = newStartTime.split(":").map(Number)
    const newEndMinutes = newStartH * 60 + newStartM + durationMinutes
    const newEndH = Math.floor(newEndMinutes / 60)
    const newEndM = newEndMinutes % 60
    const newEndTime = `${String(newEndH).padStart(2, "0")}:${String(newEndM).padStart(2, "0")}`

    // Calculate target date based on dayIndex (for week view)
    let targetDate = overData.date
    if (viewMode === "week" && overData.dayIndex !== undefined && overData.dayIndex >= 0) {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
      targetDate = new Date(weekStart)
      targetDate.setDate(weekStart.getDate() + overData.dayIndex)
    }

    onReschedule(itemId, newStartTime, newEndTime, targetDate)
  }

  // Filter and sort items for sidebar
  const sidebarItems = displayItems
    .filter((item) => {
      if (!item.date) return false
      return isSameDay(item.date, selectedDate)
    })
    .sort((a, b) => a.start.localeCompare(b.start))

  const completedCount = sidebarItems.filter((item) => item.completed).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
            <DatePicker />
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
            <Button
              variant={viewMode === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("day")}
              className="h-8 text-xs"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("week")}
              className="h-8 text-xs"
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("month")}
              className="h-8 text-xs"
            >
              Month
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 ml-2"
            title="Exit fullscreen"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden w-72 shrink-0 border-r bg-gradient-to-b from-background to-muted/20 lg:block">
          <div className="p-4">
            <div className="rounded-xl border border-border/50 bg-background p-3 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
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
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    completedCount === sidebarItems.length
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {completedCount}/{sidebarItems.length}
                </span>
              )}
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1 pb-4">
              {sidebarItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">No items</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    Add an item to get started
                  </p>
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

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 overflow-auto h-full">
            <div className="h-full min-h-full">
              {viewMode === "day" && (
                <DayGrid
                  items={displayItems}
                  selectedDate={selectedDate}
                  onReschedule={onReschedule}
                  onEditItem={onEditItem}
                  onDeleteItem={onDeleteItem}
                  onToggleComplete={onToggleComplete}
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
                  onToggleComplete={onToggleComplete}
                  onSlotClick={onSlotClick}
                  onDateSelect={onDateChange}
                  draggedItemId={draggedItem?.id || null}
                />
              )}
              {viewMode === "month" && (
                <MonthGrid
                  items={displayItems}
                  selectedDate={selectedDate}
                  onDateChange={onDateChange}
                />
              )}
            </div>
          </div>

          <DragOverlay>
            {draggedItem ? (
              <div
                className={cn(
                  "w-48 rounded-lg border p-3 shadow-lg",
                  draggedItem.itemType === "bucket-list"
                    ? "border-primary/30 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                    : "border-border/60 bg-gradient-to-br from-muted to-muted/80 text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 opacity-50" />
                  <span className="truncate text-sm font-semibold">
                    {draggedItem.title}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs opacity-80">
                  <Clock className="h-3 w-3" />
                  <span>{draggedItem.start} - {draggedItem.end}</span>
                </div>
                {draggedItem.location && (
                  <div className="mt-1 flex items-center gap-1 text-xs opacity-70">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{draggedItem.location}</span>
                  </div>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Sheet for Slot Click */}
      <Sheet
        open={isDrawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            onDrawerClose()
          }
          onDrawerOpenChange(open)
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
                onDrawerClose()
                onSuccess?.()
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Fullscreen Indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg backdrop-blur-sm">
        <Maximize2 className="h-3 w-3" />
        <span>Fullscreen Mode</span>
        <span className="ml-1 rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px]">
          ESC to exit
        </span>
      </div>
    </div>
  )
}
