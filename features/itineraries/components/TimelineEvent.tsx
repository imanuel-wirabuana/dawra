"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import {
  Trash2,
  GripVertical,
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
import ToggleItineraryItemButton from "./ToggleItineraryItemButton"
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
  showToggle?: boolean
  compact?: boolean
  onEdit?: (item: TimelineEventProps["item"]) => void
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    if (!isDragging) {
      setIsDialogOpen(true)
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

  const handleEditClick = () => {
    setIsDialogOpen(false)
    if (onEdit) {
      onEdit(item)
    }
  }

  const isBucketList = item.itemType === "bucket-list"

  return (
    <>
      {/* Grid Event Card - Minimal Info */}
      <div
        ref={setNodeRef}
        onClick={handleClick}
        className={cn(
          "group relative flex cursor-pointer flex-col gap-1 overflow-hidden rounded-lg border p-2 shadow-sm transition-all duration-200",
          compact && "p-1.5",
          isDragging && "opacity-50 scale-[1.02] shadow-lg",
          item.completed && "opacity-60 grayscale-[0.3]",
          isBucketList
            ? "border-primary/30 bg-gradient-to-br from-primary to-primary/90 shadow-primary/20 hover:shadow-md hover:from-primary/95 hover:to-primary/85"
            : "border-border/60 bg-gradient-to-br from-muted to-muted/80 hover:shadow-md hover:from-muted/90 hover:to-muted/70",
          className
        )}
        style={{ ...style, ...dragStyle }}
      >
        {/* Title Row */}
        <div className="flex items-center gap-1.5 min-w-0">
          {showToggle && (
            <ToggleItineraryItemButton
              itemId={item.id}
              completed={item.completed}
              className={cn("shrink-0", compact && "scale-75")}
            />
          )}
          <h3
            className={cn(
              "truncate flex-1 text-xs font-semibold tracking-tight leading-tight",
              isBucketList ? "text-primary-foreground" : "text-foreground",
              compact && "text-[10px]",
              item.completed && "line-through opacity-60"
            )}
          >
            {item.title}
          </h3>
        </div>

        {/* Time Row - Start - End (Duration) */}
        <div
          className={cn(
            "flex items-center gap-1 font-medium",
            compact ? "text-[9px]" : "text-[10px]",
            isBucketList
              ? "text-primary-foreground/90"
              : "text-muted-foreground/80"
          )}
        >
          <Clock
            className={cn(
              "shrink-0 opacity-50",
              compact ? "h-2.5 w-2.5" : "h-3 w-3"
            )}
          />
          <span className="tabular-nums font-semibold">{item.start}</span>
          <span className="opacity-50">-</span>
          <span className="tabular-nums">{item.end}</span>
          <span
            className={cn(
              "ml-1 rounded-full px-1.5 py-0 text-[9px] font-medium opacity-80",
              isBucketList ? "bg-primary-foreground/20" : "bg-muted-foreground/20"
            )}
          >
            ({formatDuration(item.start, item.end)})
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute top-1 right-1 flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className={cn(
                "flex items-center justify-center rounded-md p-1 transition-all duration-150 hover:scale-105",
                compact ? "p-0.5" : "p-1",
                isBucketList
                  ? "text-primary-foreground/60 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  : "text-muted-foreground/60 hover:bg-muted hover:text-destructive"
              )}
              title="Delete"
            >
              <Trash2
                className={cn(
                  "shrink-0",
                  compact ? "h-3 w-3" : "h-3.5 w-3.5"
                )}
              />
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
                  isBucketList
                    ? "text-primary-foreground/50 hover:text-primary-foreground/80"
                    : "text-muted-foreground/50 hover:text-muted-foreground/80"
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Full Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span
                className={cn(
                  "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                  isBucketList
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isBucketList ? "Bucket List" : "Custom"}
              </span>
              <span className="truncate">{item.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
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
