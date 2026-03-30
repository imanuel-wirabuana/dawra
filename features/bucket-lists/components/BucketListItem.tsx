import type { BucketList } from "@/types"
import { cn } from "@/lib/utils"
import DeleteBucketListButton from "./DeleteBucketListButton"
import ToggleBucketListButton from "./ToggleBucketListButton"
import UpdateBucketListButton from "./UpdateBucketListButton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"

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
        "group flex flex-col gap-1 rounded-lg border p-3 shadow-sm",
        isSelectionMode ? "cursor-pointer" : "cursor-default",
        isSelected
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card",
        className
      )}
      onClick={handleItemClick}
    >
      <div className="flex flex-row items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {!isSelectionMode && (
            <ToggleBucketListButton
              itemId={item.id}
              completed={item.completed}
              className="hidden group-hover:flex"
            />
          )}
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
            {item.cost && (
              <p
                className={`text-xs ${item.completed ? (isSelected ? "line-through opacity-70" : "text-muted-foreground line-through") : isSelected ? "opacity-90" : "text-muted-foreground"}`}
              >
                💰 Rp {item.cost.toLocaleString("id-ID")}
              </p>
            )}
            {item.categories && item.categories.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="h-1 w-7 px-1.5 py-0.5 text-xs"
                    style={{
                      backgroundColor: category.color,
                      color: "white",
                      border: "none",
                    }}
                  >
                    <span className="hidden">{category.name}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="">
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit" align="center">
              <div className="flex flex-row items-center gap-1">
                <UpdateBucketListButton itemId={item.id} item={item} />
                <DeleteBucketListButton itemId={item.id} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
