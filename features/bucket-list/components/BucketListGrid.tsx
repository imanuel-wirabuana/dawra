"use client"

import { useEffect, useState, useRef } from "react"
import { subscribeToBucketList } from "../services/subscribe.service"
import type { BucketList } from "@/types"
import BucketListItem from "./BucketListItem"
import { cn } from "@/lib/utils"
import { useBucketSelection } from "../hooks/useBucketSelection"
import { Button } from "@/components/ui/button"
import BulkDeleteButton, { BulkDeleteButtonRef } from "./BulkDeleteButton"
import { X, CheckSquare, ArrowLeft } from "lucide-react"
import { useHotkey } from "@tanstack/react-hotkeys"

interface BucketListGridProps {
  className?: string
}

export default function BucketListGrid({ className }: BucketListGridProps) {
  const [bucketList, setBucketList] = useState<Partial<BucketList>[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const bulkDeleteRef = useRef<BulkDeleteButtonRef>(null)

  // Extract IDs for selection logic
  const itemIds = bucketList.map((item) => item.id).filter(Boolean) as string[]

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

  return (
    <div ref={gridRef} className="space-y-3">
      {/* Combined selection mode indicator and controls */}
      {isSelectionMode ? (
        <div className="flex items-center justify-between rounded-lg border bg-primary/10 p-3">
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
          <div className="flex items-center gap-2">
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
              onClick={() => setIsSelectionMode(false)}
              className="h-7 text-xs"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Exit
            </Button>
          </div>
        </div>
      ) : bucketList.length > 0 ? (
        <div className="flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectionMode}
            className="h-7 text-xs"
          >
            <CheckSquare className="mr-1 h-3 w-3" />
            Select Items
          </Button>
        </div>
      ) : null}

      <div className={cn("grid grid-cols-1 gap-3", className)}>
        {bucketList.map((item, index) => (
          <BucketListItem
            key={index}
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
