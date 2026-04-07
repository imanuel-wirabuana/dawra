import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
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
        "group flex cursor-pointer flex-col gap-1 overflow-hidden rounded-md border p-2 shadow-sm transition-colors",
        compact && "p-1",
        isDragging && "opacity-50",
        item.completed && "opacity-75",
        item.itemType === "bucket-list"
          ? "border-primary bg-primary hover:bg-primary/80"
          : "border-muted-foreground/20 bg-muted hover:bg-muted/80",
        className
      )}
      style={{ ...style, ...dragStyle }}
    >
      {/* Header row: Type badge + Title + Toggle + Drag Handle */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex min-w-0 flex-1 items-start gap-1.5">
          {showToggle && !compact && (
            <ToggleItineraryItemButton
              itemId={item.id}
              completed={item.completed}
              className="hidden shrink-0 group-hover:flex"
            />
          )}
          <span
            className={cn(
              "shrink-0 rounded px-1 text-[7px] font-bold tracking-wider uppercase",
              compact && "text-[6px]",
              item.itemType === "bucket-list"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground"
            )}
          >
            {item.itemType === "bucket-list" ? "BL" : "CS"}
          </span>
          <h3
            className={cn(
              "truncate text-xs font-bold tracking-tight",
              item.itemType === "bucket-list"
                ? "text-primary-foreground"
                : "text-foreground",
              compact && "text-[10px]",
              item.completed && "line-through opacity-70"
            )}
          >
            {item.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className={cn(
                "opacity-0 transition-opacity hover:opacity-100",
                compact ? "opacity-60" : "group-hover:opacity-60",
                item.itemType === "bucket-list"
                  ? "text-primary-foreground/70 hover:text-primary-foreground"
                  : "text-muted-foreground/70 hover:text-destructive"
              )}
              title="Delete"
            >
              <svg
                className={cn("shrink-0", compact ? "h-3 w-3" : "h-3.5 w-3.5")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
          {draggable && (
            <div
              className={cn(
                "shrink-0 cursor-grab opacity-0 transition-opacity hover:opacity-100",
                compact ? "opacity-60" : "group-hover:opacity-60",
                "active:cursor-grabbing"
              )}
              onClick={handleHandleClick}
              {...listeners}
              {...attributes}
            >
              <svg
                className={cn(
                  "shrink-0",
                  compact ? "h-3 w-3" : "h-4 w-4",
                  item.itemType === "bucket-list"
                    ? "text-primary-foreground/50"
                    : "text-muted-foreground/50"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
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
            ? "text-primary-foreground/80"
            : "text-muted-foreground"
        )}
      >
        <span className="tabular-nums">{item.start}</span>
        <span className="opacity-40">→</span>
        <span className="tabular-nums">{item.end}</span>
        {!compact && (
          <span className="ml-1.5 text-[9px] font-normal opacity-60">
            {formatDuration(item.start, item.end)}
          </span>
        )}
      </div>

      {/* Location row */}
      {item.location && (
        <div
          className={cn(
            "flex items-center gap-1",
            compact ? "max-w-[100px] text-[9px]" : "text-[10px]",
            item.itemType === "bucket-list"
              ? "text-primary-foreground/70"
              : "text-muted-foreground/70"
          )}
          title={item.location}
        >
          <svg
            className={cn(
              "shrink-0 opacity-60",
              compact ? "h-2.5 w-2.5" : "h-3 w-3"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
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
              ? "text-primary-foreground/70"
              : "text-muted-foreground/70"
          )}
        >
          <svg
            className={cn(
              "shrink-0 opacity-60",
              compact ? "h-2.5 w-2.5" : "h-3 w-3"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium tabular-nums">
            Rp {item.cost.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      {/* Description - brief in compact */}
      {item.description && (
        <p
          className={cn(
            "leading-snug",
            compact ? "line-clamp-1 text-[9px]" : "line-clamp-2 text-[10px]",
            item.itemType === "bucket-list"
              ? "text-primary-foreground/60"
              : "text-muted-foreground/60"
          )}
        >
          {compact
            ? item.description.slice(0, 35) +
              (item.description.length > 35 ? "…" : "")
            : item.description}
        </p>
      )}

      {/* Categories - badges always */}
      {item.categories && item.categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {item.categories.slice(0, compact ? 3 : undefined).map((category) => (
            <span
              key={category.id}
              className={cn(
                "inline-flex items-center gap-1 rounded font-medium",
                compact ? "px-1.5 py-0 text-[8px]" : "px-2 py-0.5 text-[9px]"
              )}
              style={{
                backgroundColor: `${category.color}25`,
                color: category.color,
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
          {compact && item.categories.length > 3 && (
            <span
              className={cn(
                "text-[8px] font-medium",
                item.itemType === "bucket-list"
                  ? "text-primary-foreground/40"
                  : "text-muted-foreground/40"
              )}
            >
              +{item.categories.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
