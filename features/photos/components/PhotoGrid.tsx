"use client"

import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import PhotoCard from "./PhotoCard"
import PhotoViewModeSelector, {
  type PhotoViewMode,
} from "./PhotoViewModeSelector"
import PhotoBulkDeleteButton, {
  type PhotoBulkDeleteButtonRef,
} from "./PhotoBulkDeleteButton"
import { usePhotoSelection } from "../hooks/usePhotoSelection"
import { useMovePhotos } from "../hooks/useMovePhotos"
import { CheckSquare, X, ArrowLeft, Info, Folder, Filter } from "lucide-react"
import { useHotkey } from "@tanstack/react-hotkeys"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Photo, Folder as FolderType } from "@/types"
import MoveToFolderDialog from "./MoveToFolderDialog"
import PhotoGalleryModal from "./PhotoGalleryModal"

interface PhotoGridProps {
  photos: Photo[]
  onRemovePhoto: (id: string) => void
  folders?: FolderType[]
  currentFolderId?: string
  showUnassignedOnly?: boolean
  onToggleFilter?: () => void
  className?: string
}

export interface PhotoGridRef {
  setIsSelectionMode: (value: boolean) => void
}

const PhotoGrid = forwardRef<PhotoGridRef, PhotoGridProps>(
  (
    {
      photos,
      onRemovePhoto,
      folders = [],
      currentFolderId,
      showUnassignedOnly,
      onToggleFilter,
      className,
    },
    ref
  ) => {
    const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<PhotoViewMode>("masonry")
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [moveDialogOpen, setMoveDialogOpen] = useState(false)
    const [galleryOpen, setGalleryOpen] = useState(false)
    const [galleryIndex, setGalleryIndex] = useState(0)
    const bulkDeleteRef = useRef<PhotoBulkDeleteButtonRef>(null)

    // Extract IDs for selection logic
    const photoIds = photos.map((photo) => photo.id)

    const { selected, selectedIds, handleSelect, clear } = usePhotoSelection({
      ids: photoIds,
      isSelectionMode,
    })

    const movePhotosMutation = useMovePhotos()

    const toggleSelectionMode = () => {
      setIsSelectionMode(!isSelectionMode)
      if (isSelectionMode) {
        clear()
      }
    }

    const handleClear = () => {
      clear()
    }

    const handleExitSelectionMode = () => {
      setIsSelectionMode(false)
      clear()
    }

    // Expose setIsSelectionMode to parent
    useImperativeHandle(ref, () => ({
      setIsSelectionMode: (value: boolean) => {
        setIsSelectionMode(value)
        if (!value) {
          clear()
        }
      },
    }))

    // Keyboard shortcuts
    useHotkey("Escape", () => {
      if (selected.size > 0) {
        handleClear()
      } else if (isSelectionMode) {
        handleExitSelectionMode()
      }
    })

    useHotkey("Delete", () => {
      if (selected.size > 0) {
        bulkDeleteRef.current?.triggerDelete()
      }
    })

    const handleMovePhotos = async (folderId: string | null) => {
      await movePhotosMutation.mutateAsync({ photoIds: selectedIds, folderId })
      clear()
    }

    const openGallery = (index: number) => {
      setGalleryIndex(index)
      setGalleryOpen(true)
    }

    const handleRemovePhoto = async (photoId: string) => {
      setDeletingPhotoId(photoId)
      try {
        await onRemovePhoto(photoId)
      } finally {
        setDeletingPhotoId(null)
      }
    }

    const renderPhotoGrid = () => {
      const commonProps = (photo: Photo) => ({
        photo,
        folders,
        onRemove: isSelectionMode ? undefined : handleRemovePhoto,
        isDeleting: deletingPhotoId === photo.id,
        isSelected: selected.has(photo.id),
        isSelectionMode,
        onSelect: handleSelect,
      })

      switch (viewMode) {
        case "full":
          return (
            <div className="space-y-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => !isSelectionMode && openGallery(index)}
                  className={isSelectionMode ? "" : "cursor-pointer"}
                >
                  <PhotoCard
                    photo={photo}
                    folders={folders}
                    onRemove={isSelectionMode ? undefined : handleRemovePhoto}
                    isDeleting={deletingPhotoId === photo.id}
                    isSelected={selected.has(photo.id)}
                    isSelectionMode={isSelectionMode}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          )
        case "grid2x2":
          return (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => !isSelectionMode && openGallery(index)}
                  className={isSelectionMode ? "" : "cursor-pointer"}
                >
                  <PhotoCard
                    photo={photo}
                    folders={folders}
                    onRemove={isSelectionMode ? undefined : handleRemovePhoto}
                    isDeleting={deletingPhotoId === photo.id}
                    isSelected={selected.has(photo.id)}
                    isSelectionMode={isSelectionMode}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          )
        case "grid3x3":
          return (
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => !isSelectionMode && openGallery(index)}
                  className={isSelectionMode ? "" : "cursor-pointer"}
                >
                  <PhotoCard
                    photo={photo}
                    folders={folders}
                    onRemove={isSelectionMode ? undefined : handleRemovePhoto}
                    isDeleting={deletingPhotoId === photo.id}
                    isSelected={selected.has(photo.id)}
                    isSelectionMode={isSelectionMode}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          )
        case "masonry":
        default:
          return (
            <div className="columns-2 gap-4 space-y-4 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`break-inside-avoid ${isSelectionMode ? "" : "cursor-pointer"}`}
                  onClick={() => !isSelectionMode && openGallery(index)}
                >
                  <PhotoCard
                    photo={photo}
                    folders={folders}
                    onRemove={isSelectionMode ? undefined : handleRemovePhoto}
                    isDeleting={deletingPhotoId === photo.id}
                    isSelected={selected.has(photo.id)}
                    isSelectionMode={isSelectionMode}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          )
      }
    }

    return (
      <div className={className}>
        {/* Selection Mode Header */}
        {isSelectionMode ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-primary/10 p-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Selection Mode
              </span>
              {selected.size > 0 && (
                <span className="text-xs text-primary/70">
                  {selected.size} photo{selected.size !== 1 ? "s" : ""} selected
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {selected.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMoveDialogOpen(true)}
                    className="h-7 text-xs"
                  >
                    <Folder className="mr-1 h-3 w-3" />
                    Move
                  </Button>
                  <PhotoBulkDeleteButton
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
                      <p>• Click photos to select/deselect</p>
                      <p>• Ctrl+Click to toggle items</p>
                      <p>• Shift+Click to select range</p>
                      <p>• Ctrl+A to select all</p>
                      <p>• Arrow keys to navigate</p>
                      <p>• Space to select focused item</p>
                      <p>• Delete to delete selected</p>
                      <p>• Esc to exit selection mode</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/50 p-2">
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
                {photos.length} photos
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {onToggleFilter && (
                <Button
                  variant={showUnassignedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleFilter}
                  className={cn(
                    "h-6 gap-1.5 px-2 text-xs font-medium transition-all duration-150",
                    showUnassignedOnly
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border/60 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  <Filter className="h-3 w-3" />
                  {showUnassignedOnly ? "Unassigned" : "All Photos"}
                </Button>
              )}
              <div className="mx-1 h-6 w-px bg-border/50" />
              <PhotoViewModeSelector
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        )}

        {renderPhotoGrid()}

        <MoveToFolderDialog
          open={moveDialogOpen}
          onOpenChange={setMoveDialogOpen}
          folders={folders}
          selectedCount={selected.size}
          onMove={handleMovePhotos}
          currentFolderId={currentFolderId}
        />
        <PhotoGalleryModal
          photos={photos}
          currentIndex={galleryIndex}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          onNavigate={setGalleryIndex}
        />
      </div>
    )
  }
)

PhotoGrid.displayName = "PhotoGrid"

export default PhotoGrid
