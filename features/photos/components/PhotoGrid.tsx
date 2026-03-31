"use client"

import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import PhotoCard from "./PhotoCard"
import PhotoViewModeSelector, {
  type PhotoViewMode,
} from "./PhotoViewModeSelector"
import PhotoBulkDeleteButton, {
  type PhotoBulkDeleteButtonRef,
} from "./PhotoBulkDeleteButton"
import { usePhotoSelection } from "../hooks/usePhotoSelection"
import { CheckSquare, X, ArrowLeft, Info, Folder } from "lucide-react"
import { useHotkey } from "@tanstack/react-hotkeys"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Photo, Folder as FolderType } from "@/types"
import MoveToFolderDialog from "./MoveToFolderDialog"
import { movePhotosToFolder } from "../services/movePhotos.service"

interface PhotoGridProps {
  photos: Photo[]
  onRemovePhoto: (id: string) => void
  folders?: FolderType[]
  currentFolderId?: string
}

export interface PhotoGridRef {
  setIsSelectionMode: (value: boolean) => void
}

const PhotoGrid = forwardRef<PhotoGridRef, PhotoGridProps>(
  ({ photos, onRemovePhoto, folders = [], currentFolderId }, ref) => {
    const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<PhotoViewMode>("masonry")
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [moveDialogOpen, setMoveDialogOpen] = useState(false)
    const bulkDeleteRef = useRef<PhotoBulkDeleteButtonRef>(null)

    // Extract IDs for selection logic
    const photoIds = photos.map((photo) => photo.id)

    const { selected, selectedIds, handleSelect, clear } = usePhotoSelection({
      ids: photoIds,
      isSelectionMode,
    })

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
      await movePhotosToFolder(selectedIds, folderId)
      clear()
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
              {photos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  folders={folders}
                  onRemove={isSelectionMode ? undefined : handleRemovePhoto}
                  isDeleting={deletingPhotoId === photo.id}
                  isSelected={selected.has(photo.id)}
                  isSelectionMode={isSelectionMode}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )
        case "grid2x2":
          return (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  folders={folders}
                  onRemove={isSelectionMode ? undefined : handleRemovePhoto}
                  isDeleting={deletingPhotoId === photo.id}
                  isSelected={selected.has(photo.id)}
                  isSelectionMode={isSelectionMode}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )
        case "grid3x3":
          return (
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  folders={folders}
                  onRemove={isSelectionMode ? undefined : handleRemovePhoto}
                  isDeleting={deletingPhotoId === photo.id}
                  isSelected={selected.has(photo.id)}
                  isSelectionMode={isSelectionMode}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )
        case "masonry":
        default:
          return (
            <div className="columns-2 gap-4 space-y-4 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6">
              {photos.map((photo) => (
                <div key={photo.id} className="break-inside-avoid">
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
      <div>
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-medium">
              Our Memories ({photos.length})
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectionMode}
                className="h-7 text-xs"
              >
                <CheckSquare className="mr-1 h-3 w-3" />
                Select
              </Button>
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
      </div>
    )
  }
)

PhotoGrid.displayName = "PhotoGrid"

export default PhotoGrid
