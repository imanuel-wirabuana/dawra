import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ToggleItineraryItemButton from "./ToggleItineraryItemButton"

// Calculate and format duration from start and end times
const formatDuration = (start: string, end: string): string => {
  const [startH, startM] = start.split(":").map(Number)
  const [endH, endM] = end.split(":").map(Number)
  const totalMinutes = endH * 60 + endM - (startH * 60 + startM)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

interface TimelineEventProps {
  item: {
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
  className?: string
  style?: React.CSSProperties
  draggable?: boolean
  showToggle?: boolean
}

export default function TimelineEvent({
  item,
  className,
  style,
  draggable = false,
  showToggle = true,
}: TimelineEventProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: item,
      disabled: !draggable,
    })

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          ref={setNodeRef}
          {...(draggable ? { ...listeners, ...attributes } : {})}
          className={cn(
            "group flex cursor-pointer flex-col gap-0.5 rounded-md border p-2 shadow-sm transition-colors",
            draggable && "cursor-grab active:cursor-grabbing",
            isDragging && "opacity-50",
            item.completed && "opacity-75",
            item.itemType === "bucket-list"
              ? "border-primary bg-primary hover:bg-primary/80"
              : "border-muted-foreground/20 bg-muted hover:bg-muted/80",
            className
          )}
          style={{ ...style, ...dragStyle }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-start gap-2">
              {showToggle && (
                <ToggleItineraryItemButton
                  itemId={item.id}
                  completed={item.completed}
                  className="hidden shrink-0 group-hover:flex"
                />
              )}
              <span
                className={cn(
                  "shrink-0 rounded px-1 text-[8px] font-bold uppercase",
                  item.itemType === "bucket-list"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {item.itemType === "bucket-list" ? "BL" : "CS"}
              </span>
              <h3
                className={cn(
                  "truncate text-xs font-semibold text-primary-foreground",
                  item.completed && "line-through opacity-70"
                )}
              >
                {item.title}
              </h3>
            </div>
            <span className="shrink-0 text-[10px] font-medium text-primary-foreground opacity-80">
              {formatDuration(item.start, item.end)}
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 border-0 text-foreground shadow-lg"
        align="center"
        side="top"
      >
        <div className="space-y-2 px-2 py-1">
          <h4
            className={cn(
              "text-sm leading-tight font-semibold",
              item.completed && "line-through opacity-70"
            )}
          >
            {item.title}
          </h4>
          <div className="space-y-1 text-xs opacity-90">
            <div className="flex items-center gap-1">
              <span className="opacity-70">🕐</span>
              <span>
                {item.start} - {item.end}
              </span>
              <span className="ml-1 font-medium">
                ({formatDuration(item.start, item.end)})
              </span>
            </div>
            {item.location && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">📍</span>
                <span>{item.location}</span>
              </div>
            )}
            {item.cost && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">💰</span>
                <span>Rp {item.cost.toLocaleString("id-ID")}</span>
              </div>
            )}
            {item.description && (
              <div className="mt-1 border-t border-white/10 pt-1">
                <p className="leading-relaxed">{item.description}</p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
