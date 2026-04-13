"use client"

import { useEffect, useState, useRef } from "react"
import { subscribeToBucketList } from "../services/subscribe.service"
import type { BucketList, ViewMode, Category, SortOption } from "@/types"
import BucketListItem from "./BucketListItem"
import { cn } from "@/lib/utils"
import { useBucketSelection } from "../hooks/useBucketSelection"
import { Button } from "@/components/ui/button"
import BulkDeleteButton, { BulkDeleteButtonRef } from "./BulkDeleteButton"
import ViewModeSelector from "./ViewModeSelector"
import CategoryFilterSelector from "../../categories/components/CategoryFilterSelector"
import SortSelector from "./SortSelector"
import CompletedFilterSelector from "./CompletedFilterSelector"
import { X, CheckSquare, ArrowLeft, Info } from "lucide-react"
import { useHotkey } from "@tanstack/react-hotkeys"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BucketListGridProps {
  className?: string
}

export default function BucketListGrid({ className }: BucketListGridProps) {
  const [bucketList, setBucketList] = useState<Partial<BucketList>[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [filterCategories, setFilterCategories] = useState<Category[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("created-desc")
  const [completedFilter, setCompletedFilter] = useState<
    "all" | "completed" | "incomplete"
  >("all")
  const gridRef = useRef<HTMLDivElement>(null)
  const bulkDeleteRef = useRef<BulkDeleteButtonRef>(null)

  // Filter bucket list items based on selected categories and completion status
  const filteredBucketList = bucketList.filter((item) => {
    // Category filter
    const categoryMatch =
      filterCategories.length === 0
        ? true
        : !item.categories || item.categories.length === 0
          ? false
          : filterCategories.some((filterCategory) =>
              item.categories?.some(
                (itemCategory) => itemCategory.id === filterCategory.id
              )
            )

    // Completion filter
    const completionMatch =
      completedFilter === "all"
        ? true
        : completedFilter === "completed"
          ? item.completed
          : !item.completed

    return categoryMatch && completionMatch
  })

  // Sort the filtered bucket list
  const sortedBucketList = [...filteredBucketList].sort((a, b) => {
    switch (sortOption) {
      case "title-asc":
        return (a.title || "").localeCompare(b.title || "")
      case "title-desc":
        return (b.title || "").localeCompare(a.title || "")
      case "created-asc":
        return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
      case "created-desc":
        return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
      case "completed":
        return (a.completed ? 0 : 1) - (b.completed ? 0 : 1)
      case "incomplete":
        return (b.completed ? 0 : 1) - (a.completed ? 0 : 1)
      case "cost-asc":
        return (a.cost || 0) - (b.cost || 0)
      case "cost-desc":
        return (b.cost || 0) - (a.cost || 0)
      default:
        return 0
    }
  })

  // Extract IDs for selection logic and sortable context
  const itemIds = sortedBucketList
    .map((item) => item.id)
    .filter(Boolean) as string[]

  const { selected, selectedIds, handleSelect, clear } = useBucketSelection({
    ids: itemIds,
    isSelectionMode,
  })

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
  }

  const handleClear = () => {
    clear()
  }

  // Handle keyboard shortcuts with TanStack HotKeys
  useHotkey("Escape", () => {
    if (selected.size > 0) {
      handleClear()
    } else if (isSelectionMode) {
      setIsSelectionMode(false)
    }
  })

  useHotkey("Delete", () => {
    if (selected.size > 0) {
      bulkDeleteRef.current?.triggerDelete()
    }
  })

  useEffect(() => {
    subscribeToBucketList((data) => {
      setBucketList(data)
    })
  }, [])

  function handleExitSelectionMode() {
    setIsSelectionMode(false)
    clear()
  }

  return (
    <div ref={gridRef} className="flex flex-col gap-4">
      {/* Combined selection mode indicator and controls */}
      {isSelectionMode ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-gradient-to-r from-primary/20 to-primary/5 p-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Selection Mode
            </span>
            {selected.size > 0 && (
              <span className="text-xs text-primary/70">
                {selected.size} item{selected.size !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selected.size > 0 && (
              <>
                <BulkDeleteButton
                  ref={bulkDeleteRef}
                  selectedIds={selectedIds}
                  onDelete={handleClear}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 text-xs"
                >
                  <X />
                  Clear
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExitSelectionMode}
              className="h-7 text-xs"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Exit
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                  <Info className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold">Selection Guide:</p>
                  <div className="space-y-1 text-xs">
                    <p>
                      • <kbd>Click</kbd> items to select/deselect
                    </p>
                    <p>
                      • <kbd>Ctrl+Click</kbd> to toggle items
                    </p>
                    <p>
                      • <kbd>Shift+Click</kbd> to select range
                    </p>
                    <p>
                      • <kbd>Ctrl+A</kbd> to select all
                    </p>
                    <p>
                      • <kbd>Arrow keys</kbd> to navigate
                    </p>
                    <p>
                      • <kbd>Space</kbd> to select focused item
                    </p>
                    <p>
                      • <kbd>Delete</kbd> to delete selected
                    </p>
                    <p>
                      • <kbd>Esc</kbd> to exit selection mode
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : sortedBucketList.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-gradient-to-b from-card/70 to-card/40 p-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectionMode}
              className="h-8 gap-1.5 border-border/60 bg-background px-3 text-xs font-medium transition-all duration-150 hover:border-primary/50 hover:bg-primary/5"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Select
            </Button>
            <span className="text-xs text-muted-foreground">
              {sortedBucketList.length} items
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
              <CompletedFilterSelector
                currentFilter={completedFilter}
                onFilterChange={setCompletedFilter}
              />
              <div className="h-4 w-px bg-border/50" />
              <SortSelector
                currentSort={sortOption}
                onSortChange={setSortOption}
              />
            </div>
            <CategoryFilterSelector
              selectedCategories={filterCategories}
              onCategoriesChange={setFilterCategories}
            />
            <div className="mx-1 h-6 w-px bg-border/50" />
            <ViewModeSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          viewMode === "grid2"
            ? "grid grid-cols-2 gap-3"
            : viewMode === "grid3"
              ? "grid grid-cols-3 gap-3"
              : "flex flex-col gap-2",
          className
        )}
      >
        {sortedBucketList.map((item, index) => (
          <BucketListItem
            key={item.id || index}
            item={item}
            isSelected={item.id ? selected.has(item.id) : false}
            onSelect={handleSelect}
            isSelectionMode={isSelectionMode}
          />
        ))}
      </div>
    </div>
  )
}
