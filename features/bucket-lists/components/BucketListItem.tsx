import { MapPin, MoreHorizontal, Wallet } from "lucide-react"

import type { BucketList } from "@/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import DeleteBucketListButton from "./DeleteBucketListButton"
import ToggleBucketListButton from "./ToggleBucketListButton"
import UpdateBucketListButton from "./UpdateBucketListButton"

interface BucketListItemProps {
  item: Partial<BucketList>
  className?: string
  isSelected?: boolean
  onSelect?: (e: React.MouseEvent, id: string) => void
  isSelectionMode?: boolean
}

export default function BucketListItem({
  item,
  className,
  isSelected,
  onSelect,
  isSelectionMode,
}: BucketListItemProps) {
  const handleItemClick = (e: React.MouseEvent) => {
    if (isSelectionMode && onSelect && item.id) {
      onSelect(e, item.id)
    }
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 ease-out",
        isSelectionMode ? "cursor-pointer" : "cursor-default",
        isSelected
          ? "border-primary/50 bg-primary/5 shadow-md ring-1 shadow-primary/10 ring-primary/30"
          : "border-border/40 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
      onClick={handleItemClick}
    >
      {/* Header: Title + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {/* Completion Toggle */}
          {!isSelectionMode && (
            <ToggleBucketListButton
              itemId={item.id}
              completed={item.completed}
              className="shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            />
          )}

          {/* Title Section */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3
              className={cn(
                "text-sm leading-tight font-semibold tracking-tight transition-colors",
                item.completed
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              )}
            >
              {item.title}
            </h3>
          </div>
        </div>

        {/* Actions Menu */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "shrink-0 cursor-pointer rounded-md p-1.5 transition-all duration-150",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
              )}
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-1.5" align="end">
            <div className="flex items-center gap-1">
              <UpdateBucketListButton itemId={item.id} item={item} />
              <DeleteBucketListButton itemId={item.id} />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Description */}
      {item.description && (
        <p
          className={cn(
            "line-clamp-2 text-sm leading-relaxed text-muted-foreground",
            item.completed && "line-through opacity-60"
          )}
        >
          {item.description}
        </p>
      )}

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="max-w-30 truncate">{item.location}</span>
          </div>
        )}

        {/* Cost */}
        {item.cost && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Wallet className="h-3 w-3 shrink-0" />
            <span>Rp {item.cost.toLocaleString("id-ID")}</span>
          </div>
        )}
      </div>

      {/* Categories */}
      {item.categories && item.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs"
              style={{
                borderColor: `${category.color}40`,
                backgroundColor: `${category.color}15`,
              }}
            >
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span style={{ color: category.color }}>{category.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
