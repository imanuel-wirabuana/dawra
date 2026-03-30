"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import PhotoCard from "./PhotoCard"
import PhotoViewModeSelector, {
  type PhotoViewMode,
} from "./PhotoViewModeSelector"
import type { Photo } from "@/types"

interface PhotoGridProps {
  photos: Photo[]
  onRemovePhoto: (id: string) => void
}

export default function PhotoGrid({ photos, onRemovePhoto }: PhotoGridProps) {
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<PhotoViewMode>("masonry")

  const handleRemovePhoto = async (photoId: string) => {
    setDeletingPhotoId(photoId)
    try {
      await onRemovePhoto(photoId)
    } finally {
      setDeletingPhotoId(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium">Our Memories ({photos.length})</h2>
        <div className="flex items-center gap-2">
          <PhotoViewModeSelector
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      {(() => {
        switch (viewMode) {
          case "full":
            return (
              <div className="space-y-4">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onRemove={handleRemovePhoto}
                    isDeleting={deletingPhotoId === photo.id}
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
                    onRemove={handleRemovePhoto}
                    isDeleting={deletingPhotoId === photo.id}
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
                    onRemove={handleRemovePhoto}
                    isDeleting={deletingPhotoId === photo.id}
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
                      onRemove={handleRemovePhoto}
                      isDeleting={deletingPhotoId === photo.id}
                    />
                  </div>
                ))}
              </div>
            )
        }
      })()}
    </div>
  )
}
