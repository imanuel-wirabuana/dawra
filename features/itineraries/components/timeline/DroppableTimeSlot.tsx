"use client"

import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { HOUR_HEIGHT } from "./shared"

interface DroppableTimeSlotProps {
  hour: number
  minute: number
  draggedItemId: string | null
  dayIndex?: number
}

export default function DroppableTimeSlot({
  hour,
  minute,
  draggedItemId,
  dayIndex = 0,
}: DroppableTimeSlotProps) {
  const slotId = `slot-${dayIndex}-${hour}-${minute}`
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
    data: { hour, minute, dayIndex },
    disabled: !draggedItemId,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute w-full transition-colors",
        isOver && "bg-primary/20"
      )}
      style={{
        top: `${(hour + minute / 60) * HOUR_HEIGHT}px`,
        height: `${HOUR_HEIGHT / 4}px`,
      }}
    />
  )
}
