"use client"

import { useRealtimePhotos } from "@/features/photos/hooks/useRealtimePhotos"
import { useUploadPhoto } from "@/features/photos/hooks/useUploadPhoto"
import { useDeletePhoto } from "@/features/photos/hooks/useDeletePhoto"
import PhotoUploadArea from "@/features/photos/components/PhotoUploadArea"
import PhotoGrid from "@/features/photos/components/PhotoGrid"
import EmptyState from "@/features/photos/components/EmptyState"
import LoadingState from "@/features/photos/components/LoadingState"

export default function PhotoWall() {
  const { photos, loading } = useRealtimePhotos()
  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadPhoto()
  const { mutateAsync: deletePhoto } = useDeletePhoto()

  const handleUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map((file) => uploadPhoto(file))

    try {
      await Promise.all(uploadPromises)
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  const handleRemovePhoto = async (photoId: string) => {
    try {
      await deletePhoto(photoId)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Photo Wall</h1>

      <div className="flex flex-col gap-4">
        {/* Upload Section */}
        <PhotoUploadArea isUploading={isUploading} onUpload={handleUpload} />
        <div>
          {/* Photo Grid */}
          {photos.length > 0 && (
            <PhotoGrid photos={photos} onRemovePhoto={handleRemovePhoto} />
          )}

          {/* Empty State */}
          {photos.length === 0 && !loading && <EmptyState />}

          {/* Loading State */}
          {loading && <LoadingState />}
        </div>
      </div>
    </div>
  )
}
