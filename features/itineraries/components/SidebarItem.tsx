"use client"

import { useState } from "react"
import {
  Clock,
  MapPin,
  Check,
  Tag,
  Banknote,
  ArrowRight,
  DollarSign,
  FileText,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Item } from "./timeline/shared"
import { formatDuration } from "./timeline/shared"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface SidebarItemProps {
  item: Item
  onToggleComplete?: (id: string, completed: boolean) => void
  onEdit?: (item: Item) => void
  onDelete?: (id: string) => void
}

export default function SidebarItem({
  item,
  onToggleComplete,
  onEdit,
  onDelete,
}: SidebarItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPendingToggle, setIsPendingToggle] = useState(false)

  const hasDetails =
    item.location ||
    item.cost ||
    (item.categories && item.categories.length > 0)
  const isBucketList = item.itemType === "bucket-list"

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

  const handleDelete = () => {
    setIsDialogOpen(false)
    if (onDelete) {
      onDelete(item.id)
    }
  }

  const handleClick = () => {
    setIsDialogOpen(true)
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "flex cursor-pointer flex-col gap-1.5 rounded-lg border p-3 text-xs transition-all duration-150 hover:shadow-md",
          isBucketList
            ? "border-primary/20 bg-gradient-to-r from-primary/5 to-transparent"
            : "border-border/50 bg-muted/30",
          item.completed && "opacity-60 grayscale"
        )}
      >
        {/* Header Row */}
        <div className="flex items-start gap-2">
          {/* Checkbox for toggle complete */}
          {onToggleComplete && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                handleToggleComplete()
              }}
              className="shrink-0"
            >
              <Checkbox
                checked={item.completed}
                disabled={isPendingToggle}
                className={cn(
                  "h-4 w-4 border-2",
                  item.completed
                    ? "border-emerald-500 bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                    : "border-muted-foreground/30"
                )}
              />
            </div>
          )}
          <span
            className={cn(
              "shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase shadow-sm",
              isBucketList
                ? "bg-primary text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground"
            )}
          >
            {isBucketList ? "BL" : "CS"}
          </span>
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "text-sm leading-tight font-medium",
                item.completed && "line-through"
              )}
            >
              {item.title}
            </div>
          </div>
          {item.completed && !onToggleComplete && (
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>

        {/* Time & Duration */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {item.start} - {item.end}
            </span>
          </div>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
            {formatDuration(item.start, item.end)}
          </span>
        </div>

        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}

        {/* Cost */}
        {item.cost !== undefined && item.cost > 0 && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Banknote className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">
              Rp {item.cost.toLocaleString("id-ID")}
            </span>
          </div>
        )}

        {/* Categories */}
        {item.categories && item.categories.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {item.categories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px]"
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

        {/* Description - truncated */}
        {item.description && (
          <div className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground/80">
            {item.description}
          </div>
        )}

        {/* Compact indicator for items with no extra details */}
        {!hasDetails && !item.description && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <Tag className="h-2.5 w-2.5" />
            <span>No additional details</span>
          </div>
        )}
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
