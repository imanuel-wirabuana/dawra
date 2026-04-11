import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { Trash2, GripVertical, MapPin, DollarSign, ArrowRight, Clock, FileText } from "lucide-react"
import type { Category } from "@/types"
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
    categories?: Category[]
  }
  className?: string
  style?: React.CSSProperties
  draggable?: boolean
  showToggle?: boolean
  compact?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function TimelineEvent({
  item,
  className,
  style,
  draggable = false,
  showToggle = true,
  compact = false,
  onEdit,
  onDelete,
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

  const handleClick = () => {
    if (!isDragging && onEdit) {
      onEdit()
    }
  }

  const handleHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={cn(
        "group flex cursor-pointer flex-col gap-1 overflow-hidden rounded-lg border p-2 shadow-sm transition-all duration-200",
        compact && "p-1.5",
        isDragging && "opacity-50 scale-[1.02] shadow-lg",
        item.completed && "opacity-60 grayscale-[0.3]",
        item.itemType === "bucket-list"
          ? "border-primary/30 bg-gradient-to-br from-primary to-primary/90 shadow-primary/20 hover:shadow-md hover:from-primary/95 hover:to-primary/85"
          : "border-border/60 bg-gradient-to-br from-muted to-muted/80 hover:shadow-md hover:from-muted/90 hover:to-muted/70",
        className
      )}
      style={{ ...style, ...dragStyle }}
    >
      {/* Header row: Toggle + Type badge + Title + Actions */}
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex min-w-0 flex-1 items-start gap-1.5">
          {showToggle && (
            <ToggleItineraryItemButton
              itemId={item.id}
              completed={item.completed}
              className={cn("shrink-0", compact && "scale-75")}
            />
          )}
          <div className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5",
            compact && "gap-1"
          )}>
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 text-[7px] font-bold tracking-wider uppercase shadow-sm",
                compact && "text-[6px] px-1 py-0.5",
                item.itemType === "bucket-list"
                  ? "bg-primary-foreground/25 text-primary-foreground ring-1 ring-primary-foreground/20"
                  : "bg-muted-foreground/15 text-muted-foreground ring-1 ring-muted-foreground/10"
              )}
            >
              {item.itemType === "bucket-list" ? "BL" : "CS"}
            </span>
            <h3
              className={cn(
                "truncate text-xs font-semibold tracking-tight leading-tight",
                item.itemType === "bucket-list"
                  ? "text-primary-foreground"
                  : "text-foreground",
                compact && "text-[10px]",
                item.completed && "line-through opacity-60"
              )}
            >
              {item.title}
            </h3>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className={cn(
                "flex items-center justify-center rounded-md p-1 transition-all duration-150 hover:scale-105",
                compact ? "p-0.5" : "p-1",
                item.itemType === "bucket-list"
                  ? "text-primary-foreground/60 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  : "text-muted-foreground/60 hover:bg-muted hover:text-destructive"
              )}
              title="Delete"
            >
              <Trash2 className={cn("shrink-0", compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
            </button>
          )}
          {draggable && (
            <div
              className={cn(
                "flex shrink-0 cursor-grab items-center justify-center rounded-md p-1 transition-all duration-150 hover:scale-105",
                compact ? "p-0.5" : "p-1",
                "active:cursor-grabbing"
              )}
              onClick={handleHandleClick}
              {...listeners}
              {...attributes}
            >
              <GripVertical
                className={cn(
                  "shrink-0",
                  compact ? "h-3 w-3" : "h-4 w-4",
                  item.itemType === "bucket-list"
                    ? "text-primary-foreground/50 hover:text-primary-foreground/80"
                    : "text-muted-foreground/50 hover:text-muted-foreground/80"
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Time row - always show full range */}
      <div
        className={cn(
          "flex items-center gap-1 font-medium",
          compact ? "text-[9px]" : "text-[10px]",
          item.itemType === "bucket-list"
            ? "text-primary-foreground/90"
            : "text-muted-foreground/80"
        )}
      >
        <Clock className={cn("shrink-0 opacity-50", compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
        <span className="tabular-nums font-semibold">{item.start}</span>
        <ArrowRight className={cn("shrink-0 opacity-40", compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
        <span className="tabular-nums">{item.end}</span>
        {!compact && (
          <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0 text-[9px] font-medium opacity-80">
            {formatDuration(item.start, item.end)}
          </span>
        )}
      </div>

      {/* Location row */}
      {item.location && (
        <div
          className={cn(
            "flex items-center gap-1",
            compact ? "max-w-25 text-[9px]" : "text-[10px]",
            item.itemType === "bucket-list"
              ? "text-primary-foreground/80"
              : "text-muted-foreground/80"
          )}
          title={item.location}
        >
          <MapPin
            className={cn(
              "shrink-0 opacity-70",
              compact ? "h-2.5 w-2.5" : "h-3 w-3"
            )}
          />
          <span className="truncate font-medium">
            {compact
              ? item.location.slice(0, 15) +
                (item.location.length > 15 ? "…" : "")
              : item.location}
          </span>
        </div>
      )}

      {/* Cost row */}
      {item.cost && item.cost > 0 && (
        <div
          className={cn(
            "flex items-center gap-1",
            compact ? "text-[9px]" : "text-[10px]",
            item.itemType === "bucket-list"
              ? "text-primary-foreground/85"
              : "text-muted-foreground/85"
          )}
        >
          <DollarSign
            className={cn(
              "shrink-0 opacity-70",
              compact ? "h-2.5 w-2.5" : "h-3 w-3"
            )}
          />
          <span className="font-semibold tabular-nums">
            Rp {item.cost.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      {/* Description - brief in compact */}
      {item.description && (
        <div
          className={cn(
            "flex items-start gap-1",
            compact && "hidden"
          )}
        >
          <FileText className={cn(
            "shrink-0 mt-0.5 opacity-50",
            compact ? "h-2.5 w-2.5" : "h-3 w-3",
            item.itemType === "bucket-list"
              ? "text-primary-foreground/60"
              : "text-muted-foreground/60"
          )} />
          <p
            className={cn(
              "leading-snug flex-1",
              compact ? "line-clamp-1 text-[9px]" : "line-clamp-2 text-[10px]",
              item.itemType === "bucket-list"
                ? "text-primary-foreground/70"
                : "text-muted-foreground/70"
            )}
          >
            {compact
              ? item.description.slice(0, 35) +
                (item.description.length > 35 ? "…" : "")
              : item.description}
          </p>
        </div>
      )}

      {/* Categories - badges always */}
      {item.categories && item.categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mt-0.5">
          {item.categories.slice(0, compact ? 2 : undefined).map((category) => (
            <span
              key={category.id}
              className={cn(
                "inline-flex items-center gap-1 rounded-full font-medium shadow-sm",
                compact ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-0.5 text-[9px]"
              )}
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
                boxShadow: `0 0 0 1px ${category.color}30`,
              }}
            >
              <span
                className={cn(
                  "rounded-full",
                  compact ? "h-1.5 w-1.5" : "h-2 w-2"
                )}
                style={{ backgroundColor: category.color }}
              />
              <span className="tracking-tight">{category.name}</span>
            </span>
          ))}
          {compact && item.categories.length > 2 && (
            <span
              className={cn(
                "text-[8px] font-medium px-1 py-0.5 rounded-full bg-background/30",
                item.itemType === "bucket-list"
                  ? "text-primary-foreground/60"
                  : "text-muted-foreground/60"
              )}
            >
              +{item.categories.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
