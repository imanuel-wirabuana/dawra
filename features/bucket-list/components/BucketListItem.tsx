import type { BucketList } from "@/types"
import { cn } from "@/lib/utils"
import DeleteBucketListItemButton from "./DeleteBucketListItemButton"
import ToggleBucketListItemButton from "./ToggleBucketListItemButton"
import UpdateBucketListItemButton from "./UpdateBucketListItemButton"

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
        "flex flex-col gap-1 rounded-lg border p-3 shadow-sm",
        isSelectionMode ? "cursor-pointer" : "cursor-default",
        isSelected
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card",
        className
      )}
      onClick={handleItemClick}
    >
      <div className="flex flex-row items-start justify-between gap-3 lg:items-center">
        <div className="flex items-start gap-2">
          <ToggleBucketListItemButton
            itemId={item.id}
            completed={item.completed}
          />
          <div>
            <h3
              className={`text-xs font-semibold ${item.completed ? (isSelected ? "line-through opacity-70" : "text-muted-foreground line-through") : ""}`}
            >
              {item.title}
            </h3>
            <p
              className={`text-xs ${item.completed ? (isSelected ? "line-through opacity-70" : "text-muted-foreground line-through") : isSelected ? "opacity-90" : "text-muted-foreground"}`}
            >
              {item.description}
            </p>
            {item.location && (
              <p
                className={`text-xs ${item.completed ? (isSelected ? "line-through opacity-70" : "text-muted-foreground line-through") : isSelected ? "opacity-90" : "text-muted-foreground"}`}
              >
                📍 {item.location}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <UpdateBucketListItemButton itemId={item.id} item={item} />
          <DeleteBucketListItemButton itemId={item.id} />
        </div>
      </div>
    </div>
  )
}
