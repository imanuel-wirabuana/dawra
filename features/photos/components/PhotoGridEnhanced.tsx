"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  Trash2,
  Move,
  Grid3X3,
  LayoutGrid,
  LayoutTemplate,
  X,
  Download,
  Loader2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { Photo } from "@/types"
import { Button } from "@/components/ui/button"
import { staggerContainer, staggerItem } from "@/lib/animations"
import { PhotoSkeleton } from "@/components/ui/shimmer-skeleton"

import PhotoCardEnhanced from "./PhotoCardEnhanced"

type ViewMode = "grid" | "masonry" | "compact"

interface PhotoGridEnhancedProps {
  photos: Photo[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onDelete?: (ids: string[]) => void
  onMove?: (ids: string[], folderId: string) => void
  onDownload?: (photo: Photo) => void
  emptyState?: React.ReactNode
  className?: string
}

export default function PhotoGridEnhanced({
  photos,
  isLoading,
  hasMore,
  onLoadMore,
  onDelete,
  onMove,
  onDownload,
  emptyState,
  className,
}: PhotoGridEnhancedProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || !onLoadMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, onLoadMore])

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(photos.map((p) => p.id)))
  }, [photos])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
    setSelectionMode(false)
  }, [])

  const handleBulkDelete = async () => {
    if (!onDelete) return
    setIsBulkActionLoading(true)
    await onDelete(Array.from(selectedIds))
    clearSelection()
    setIsBulkActionLoading(false)
  }

  const handleBulkMove = async (folderId: string) => {
    if (!onMove) return
    setIsBulkActionLoading(true)
    await onMove(Array.from(selectedIds), folderId)
    clearSelection()
    setIsBulkActionLoading(false)
  }

  // Masonry column distribution - memoized
  const masonryColumns = useMemo(() => {
    const columns: Photo[][] = [[], [], []]
    photos.forEach((photo, index) => {
      const columnIndex = index % 3
      columns[columnIndex].push(photo)
    })
    return columns
  }, [photos])

  if (photos.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        {emptyState || (
          <>
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-muted-foreground">No photos yet</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Upload some photos to get started
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border/50 bg-muted/50 p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "masonry" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("masonry")}
            >
              <LayoutTemplate className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "compact" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("compact")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Selection Toggle */}
          <Button
            variant={selectionMode ? "secondary" : "outline"}
            size="sm"
            className="h-8"
            onClick={() => {
              setSelectionMode(!selectionMode)
              if (selectionMode) clearSelection()
            }}
          >
            {selectionMode ? (
              <>
                <X className="mr-1 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Check className="mr-1 h-4 w-4" />
                Select
              </>
            )}
          </Button>

          {selectionMode && selectedIds.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectionMode && selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={selectAll}
              >
                All
              </Button>
              <div className="h-4 w-px bg-border" />
              {onDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    selectedIds.forEach((id) => {
                      const photo = photos.find((p) => p.id === id)
                      if (photo) onDownload(photo)
                    })
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {onMove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleBulkMove("folder-id")}
                  disabled={isBulkActionLoading}
                >
                  {isBulkActionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Move className="h-4 w-4" />
                  )}
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={handleBulkDelete}
                  disabled={isBulkActionLoading}
                >
                  {isBulkActionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={clearSelection}
              >
                Clear
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo Grid */}
      {isLoading && photos.length === 0 ? (
        <div
          className={cn(
            "grid gap-3",
            viewMode === "compact"
              ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          )}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <PhotoSkeleton key={i} />
          ))}
        </div>
      ) : viewMode === "masonry" ? (
        <div className="flex gap-3">
          {masonryColumns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-1 flex-col gap-3">
              {column.map((photo, index) => (
                <PhotoCardEnhanced
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedIds.has(photo.id)}
                  onSelect={() => toggleSelection(photo.id)}
                  isSelectionMode={selectionMode}
                  index={colIndex * 3 + index}
                  layout="masonry"
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={cn(
            "grid gap-3",
            viewMode === "compact"
              ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          )}
        >
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                variants={staggerItem}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <PhotoCardEnhanced
                  photo={photo}
                  isSelected={selectedIds.has(photo.id)}
                  onSelect={() => toggleSelection(photo.id)}
                  isSelectionMode={selectionMode}
                  index={index}
                  layout="grid"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          ) : (
            <div className="h-8" />
          )}
        </div>
      )}
    </div>
  )
}
