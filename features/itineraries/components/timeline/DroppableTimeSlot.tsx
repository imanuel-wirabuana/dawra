"use client"

import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { HOUR_HEIGHT } from "./shared"

interface DroppableTimeSlotProps {
  hour: number
  minute: number
  draggedItemId: string | null
  dayIndex?: number
  onClick?: (hour: number, minute: number, dayIndex: number) => void
}

export default function DroppableTimeSlot({
  hour,
  minute,
  draggedItemId,
  dayIndex = 0,
  onClick,
}: DroppableTimeSlotProps) {
  const slotId = `slot-${dayIndex}-${hour}-${minute}`
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
    data: { hour, minute, dayIndex },
    disabled: !draggedItemId,
  })

  const handleClick = () => {
    if (!draggedItemId && onClick) {
      onClick(hour, minute, dayIndex)
    }
  }

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={cn(
        "absolute w-full cursor-pointer transition-colors hover:bg-primary/10",
        isOver && "bg-primary/20"
      )}
      style={{
        top: `${(hour + minute / 60) * HOUR_HEIGHT}px`,
        height: `${HOUR_HEIGHT / 4}px`,
      }}
    />
  )
}
