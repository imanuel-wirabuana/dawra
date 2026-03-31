"use client"

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { useDroppable } from "@dnd-kit/core"
import TimelineEvent from "./TimelineEvent"
import { Trash2, Pencil } from "lucide-react"
import { useTimelineStore } from "../store/useTimelineStore"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type Item = {
  id: string
  itemType: "bucket-list" | "custom"
  title: string
  start: string
  end: string
  location?: string
  cost?: number
  description?: string
  completed?: boolean
}

interface GridTimelineProps {
  items: Item[]
  onDeleteItem: (id: string) => void
  onEditItem?: (item: Item) => void
  onReschedule?: (id: string, newStartTime: string, newEndTime: string) => void
}

const SIDEBAR_WIDTH = 160

const timeToIndex = (time: string, slotDuration: number) => {
  const [h, m] = time.split(":").map(Number)
  return (h * 60 + m) / slotDuration
}

const generateSlots = (slotDuration: number) => {
  const slots = []
  for (let i = 0; i < 24 * 60; i += slotDuration) {
    const h = String(Math.floor(i / 60)).padStart(2, "0")
    const m = String(i % 60).padStart(2, "0")
    slots.push(`${h}:${m}`)
  }
  return slots
}

// Convert slot index to time string (HH:MM)
const indexToTime = (index: number, slotDuration: number): string => {
  const minutes = index * slotDuration
  const h = String(Math.floor(minutes / 60)).padStart(2, "0")
  const m = String(minutes % 60).padStart(2, "0")
  return `${h}:${m}`
}

// Calculate duration in minutes between two times
const getDurationMinutes = (start: string, end: string): number => {
  const [startH, startM] = start.split(":").map(Number)
  const [endH, endM] = end.split(":").map(Number)
  return endH * 60 + endM - (startH * 60 + startM)
}

// Format duration as "2h 30m"
const formatDuration = (start: string, end: string): string => {
  const totalMinutes = getDurationMinutes(start, end)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

// Droppable grid cell component
interface DroppableGridCellProps {
  id: string
  index: number
  slotDuration: number
  isHour: boolean
  draggedItemId: string | null
}

function DroppableGridCell({
  id,
  index,
  slotDuration,
  isHour,
  draggedItemId,
}: DroppableGridCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${id}-slot-${index}`,
    data: { slotIndex: index, itemId: id },
    disabled: !draggedItemId || draggedItemId !== id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-l transition-colors",
        isHour ? "border-muted-foreground/30" : "border-muted-foreground/10",
        isOver && "bg-primary/30"
      )}
    />
  )
}

export default function GridTimeline({
  items,
  onDeleteItem,
  onEditItem,
  onReschedule,
}: GridTimelineProps) {
  const { slotWidth, slotDuration } = useTimelineStore()
  const [isMobile, setIsMobile] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Item | null>(null)

  // Configure dnd-kit sensors for smooth dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Start dragging after moving 5px
      },
    })
  )

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground">
          <h3 className="text-lg font-semibold">No itinerary items</h3>
          <p className="text-sm">Start by adding items to your itinerary</p>
        </div>
      </div>
    )
  }

  // Mobile vertical layout
  if (isMobile) {
    const sortedItems = [...items].sort((a, b) =>
      a.start.localeCompare(b.start)
    )

    return (
      <div className="space-y-4 p-4">
        {sortedItems.map((item, index) => (
          <div key={item.id} className="flex gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </div>
              {index < sortedItems.length - 1 && (
                <div className="mt-2 h-full w-0.5 bg-border" />
              )}
            </div>

            {/* Content */}
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

  // Desktop horizontal layout
  const totalSlots = (24 * 60) / slotDuration
  const slots = generateSlots(slotDuration)

  const handleDragStart = (event: DragStartEvent) => {
    const item = items.find((i) => i.id === event.active.id)
    if (item) {
      setDraggedItem(item)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !onReschedule || !draggedItem) {
      setDraggedItem(null)
      return
    }

    // Get the slot index from the droppable
    const slotIndex = over.data.current?.slotIndex as number
    if (slotIndex === undefined) {
      setDraggedItem(null)
      return
    }

    // Calculate new start time based on drop position
    const newStart = indexToTime(slotIndex, slotDuration)
    const duration = getDurationMinutes(draggedItem.start, draggedItem.end)
    const newEndMinutes = slotIndex * slotDuration + duration
    const newEndH = String(Math.floor(newEndMinutes / 60)).padStart(2, "0")
    const newEndM = String(newEndMinutes % 60).padStart(2, "0")
    const newEnd = `${newEndH}:${newEndM}`

    onReschedule(draggedItem.id, newStart, newEnd)
    setDraggedItem(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full overflow-x-auto border bg-background">
        {/* HEADER */}
        <div
          className="sticky top-0 z-30 grid w-max border-b bg-primary/10 text-xs"
          style={{
            gridTemplateColumns: `${SIDEBAR_WIDTH}px repeat(${totalSlots}, ${slotWidth}px)`,
          }}
        >
          {/* Sticky Task Header */}
          <div className="sticky left-0 z-40 border-r bg-transparent p-3 font-medium text-primary-foreground shadow-sm"></div>

          {slots.map((s, i) => {
            const isHour = i % 4 === 0
            return (
              <div
                key={i}
                className={`relative border-l ${
                  isHour
                    ? "border-muted-foreground/40 bg-muted/30"
                    : "border-muted-foreground/10"
                }`}
              >
                {isHour && (
                  <span className="absolute top-1 left-1 text-[10px] font-semibold text-muted-foreground">
                    {s}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* ROWS */}
        {items.map((item) => {
          const start = timeToIndex(item.start, slotDuration)
          const end = timeToIndex(item.end, slotDuration)
          const span = end - start

          return (
            <div
              key={item.id}
              className="relative grid h-12 w-max border-b"
              style={{
                gridTemplateColumns: `${SIDEBAR_WIDTH}px repeat(${totalSlots}, ${slotWidth}px)`,
              }}
            >
              {/* Sticky Task Column */}
              <div
                className={cn(
                  "sticky left-0 z-20 flex items-center justify-between truncate border-r p-2 text-sm",
                  item.itemType === "bucket-list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span className="truncate px-1">{item.title}</span>
                <div className="flex gap-1">
                  {item.itemType === "custom" && onEditItem && (
                    <button
                      onClick={() => onEditItem(item)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-muted-foreground/10 hover:text-muted-foreground"
                      title="Edit item"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                      item.itemType === "bucket-list"
                        ? "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                        : "text-muted-foreground/70 hover:bg-muted-foreground/10 hover:text-muted-foreground"
                    )}
                    title="Delete item"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* GRID BACKGROUND */}
              {Array.from({ length: totalSlots }).map((_, i) => {
                const isHour = i % 4 === 0
                return (
                  <DroppableGridCell
                    key={i}
                    id={item.id}
                    index={i}
                    slotDuration={slotDuration}
                    isHour={isHour}
                    draggedItemId={draggedItem?.id || null}
                  />
                )
              })}

              {/* EVENT */}
              <TimelineEvent
                item={{
                  id: item.id,
                  itemType: item.itemType,
                  title: item.title,
                  start: item.start,
                  end: item.end,
                  location: item.location,
                  cost: item.cost,
                  description: item.description,
                  completed: item.completed,
                }}
                draggable={!!onReschedule}
                style={{
                  position: "absolute",
                  left: `calc(${SIDEBAR_WIDTH}px + ${start * slotWidth}px)`,
                  width: `${span * slotWidth}px`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Drag Overlay for smooth visual feedback */}
      <DragOverlay dropAnimation={null}>
        {draggedItem ? (
          <div
            className={cn(
              "flex cursor-grabbing flex-col gap-0.5 rounded-md border p-2 shadow-lg",
              draggedItem.itemType === "bucket-list"
                ? "border-primary bg-primary"
                : "border-muted-foreground/20 bg-muted"
            )}
            style={{
              width: `${(timeToIndex(draggedItem.end, slotDuration) - timeToIndex(draggedItem.start, slotDuration)) * slotWidth}px`,
            }}
          >
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "shrink-0 rounded px-1 text-[8px] font-bold uppercase",
                  draggedItem.itemType === "bucket-list"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {draggedItem.itemType === "bucket-list" ? "BL" : "CS"}
              </span>
              <h3 className="truncate text-xs font-semibold text-primary-foreground">
                {draggedItem.title}
              </h3>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
