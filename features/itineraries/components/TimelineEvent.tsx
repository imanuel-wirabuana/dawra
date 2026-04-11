"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import {
  Trash2,
  MapPin,
  DollarSign,
  ArrowRight,
  Clock,
  FileText,
  Pencil,
  Tag,
  CheckCircle2,
  X,
} from "lucide-react"
import type { Category } from "@/types"
import { getDurationMinutes } from "./timeline/shared"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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
  compact?: boolean
  onEdit?: (item: TimelineEventProps["item"]) => void
  onDelete?: () => void
  onToggleComplete?: (id: string, completed: boolean) => void
}

export default function TimelineEvent({
  item,
  className,
  style,
  draggable = false,
  compact = false,
  onEdit,
  onDelete,
  onToggleComplete,
}: TimelineEventProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: item,
      disabled: !draggable,
    })

  const [isPendingToggle, setIsPendingToggle] = useState(false)

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const handleClick = () => {
    if (!isDragging) {
      setIsDialogOpen(true)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  const handleToggleComplete = async () => {
    if (!onToggleComplete) return
    setIsPendingToggle(true)
    await onToggleComplete(item.id, !item.completed)
    setIsPendingToggle(false)
  }

  const handleEditClick = () => {
    setIsDialogOpen(false)
    if (onEdit) {
      onEdit(item)
    }
  }

  const isBucketList = item.itemType === "bucket-list"

  // Check if event fits in one 15-minute slot (15 min or less)
  const durationMinutes = getDurationMinutes(item.start, item.end)
  const isShortEvent = durationMinutes <= 15

  // Determine card background based on categories
  const categories = item.categories || []
  const hasCategories = categories.length > 0
  const cardBgStyle = hasCategories
    ? categories.length >= 2
      ? {
          background: `linear-gradient(135deg, ${categories[0].color} 0%, ${categories[1].color} 100%)`,
        }
      : { backgroundColor: categories[0].color }
    : undefined

  return (
    <>
      {/* Grid Event Card - Minimal Info - Entire card is draggable handle */}
      <div
        ref={setNodeRef}
        onClick={handleClick}
        {...(draggable ? { ...listeners, ...attributes } : {})}
        className={cn(
          "group flex cursor-pointer flex-col gap-1 overflow-hidden rounded-lg border p-2 shadow-sm transition-all duration-200",
          compact && "p-1.5",
          isShortEvent && "justify-center",
          draggable && "cursor-grab active:cursor-grabbing",
          isDragging && "opacity-50 scale-[1.02] shadow-lg",
          item.completed && "opacity-60 grayscale-[0.3]",
          !hasCategories && isBucketList
            ? "border-primary/30 bg-gradient-to-br from-primary to-primary/90 shadow-primary/20 hover:shadow-md hover:from-primary/95 hover:to-primary/85"
            : !hasCategories
              ? "border-border/60 bg-gradient-to-br from-muted to-muted/80 hover:shadow-md hover:from-muted/90 hover:to-muted/70"
              : "border-white/30 shadow-lg hover:shadow-xl hover:brightness-110",
          className
        )}
        style={cardBgStyle ? { ...style, ...dragStyle, ...cardBgStyle } : { ...style, ...dragStyle }}
      >
        {/* Title Row */}
        <h3
          className={cn(
            "truncate text-xs font-semibold tracking-tight leading-tight",
            hasCategories ? "text-white drop-shadow-sm" : isBucketList ? "text-primary-foreground" : "text-foreground",
            compact && "text-[10px]",
            item.completed && "line-through opacity-60"
          )}
        >
          {item.title}
        </h3>

        {/* Time Row - Hidden for short 15-min events */}
        {!isShortEvent && (
          <div
            className={cn(
              "flex items-center gap-1 font-medium",
              compact ? "text-[9px]" : "text-[10px]",
              hasCategories
                ? "text-white/90"
                : isBucketList
                  ? "text-primary-foreground/90"
                  : "text-muted-foreground/80"
            )}
          >
            <Clock
              className={cn(
                "shrink-0 opacity-50",
                compact ? "h-2.5 w-2.5" : "h-3 w-3",
                hasCategories && "text-white/70"
              )}
            />
            <span className="tabular-nums font-semibold">{item.start}</span>
            <span className="opacity-50">-</span>
            <span className="tabular-nums">{item.end}</span>
            <span
              className={cn(
                "ml-1 rounded-full px-1.5 py-0 text-[9px] font-medium opacity-80",
                hasCategories
                  ? "bg-white/20 text-white"
                  : isBucketList
                    ? "bg-primary-foreground/20"
                    : "bg-muted-foreground/20"
              )}
            >
              ({formatDuration(item.start, item.end)})
            </span>
          </div>
        )}
      </div>

      {/* Full Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          {/* Category-colored header */}
          <div
            className="-mt-6 -mx-6 mb-4 px-6 py-4"
            style={
              item.categories && item.categories.length >= 2
                ? {
                    background: `linear-gradient(135deg, ${item.categories[0].color} 0%, ${item.categories[1].color} 100%)`,
                  }
                : item.categories && item.categories.length === 1
                  ? { backgroundColor: item.categories[0].color }
                  : isBucketList
                    ? { backgroundColor: "hsl(var(--primary))" }
                    : { backgroundColor: "hsl(var(--muted))" }
            }
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <span
                  className={cn(
                    "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                    "bg-white/20 text-white backdrop-blur-sm"
                  )}
                >
                  {isBucketList ? "Bucket List" : "Custom"}
                </span>
                <span className="truncate text-white drop-shadow-sm">{item.title}</span>
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="space-y-4">
            {/* Time */}
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold tabular-nums">{item.start}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-semibold tabular-nums">{item.end}</span>
                <span className="text-muted-foreground">
                  ({formatDuration(item.start, item.end)})
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <CheckCircle2
                className={cn(
                  "h-4 w-4",
                  item.completed ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="text-sm">
                {item.completed ? "Completed" : "Not completed"}
              </span>
            </div>

            {/* Location */}
            {item.location && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{item.location}</span>
              </div>
            )}

            {/* Cost */}
            {item.cost && item.cost > 0 && (
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  Rp {item.cost.toLocaleString("id-ID")}
                </span>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm leading-relaxed">{item.description}</p>
              </div>
            )}

            {/* Categories */}
            {item.categories && item.categories.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-wrap gap-1.5">
                  {item.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
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
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {onDelete && (
                <Button
                  variant="outline"
                  className="flex-1 text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete
                </Button>
              )}
              {onToggleComplete && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleToggleComplete}
                  disabled={isPendingToggle}
                >
                  <CheckCircle2
                    className={cn(
                      "mr-1.5 h-4 w-4",
                      item.completed ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {item.completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="mr-1.5 h-4 w-4" />
                Close
              </Button>
              {onEdit && (
                <Button className="flex-1" onClick={handleEditClick}>
                  <Pencil className="mr-1.5 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}
