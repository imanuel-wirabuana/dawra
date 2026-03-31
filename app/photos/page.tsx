"use client"

import { useRealtimePhotos } from "@/features/photos/hooks/useRealtimePhotos"
import { useRealtimeFolders } from "@/features/photos/hooks/useRealtimeFolders"
import { useDeleteFolder } from "@/features/photos/hooks/useDeleteFolder"
import { useUploadPhoto } from "@/features/photos/hooks/useUploadPhoto"
import { useDeletePhoto } from "@/features/photos/hooks/useDeletePhoto"
import PhotoUploadArea from "@/features/photos/components/PhotoUploadArea"
import PhotoGrid from "@/features/photos/components/PhotoGrid"
import FolderGrid from "@/features/photos/components/FolderGrid"
import CreateFolderDialog from "@/features/photos/components/CreateFolderDialog"
import EmptyState from "@/features/photos/components/EmptyState"
import LoadingState from "@/features/photos/components/LoadingState"
import { useState } from "react"

export default function PhotoWall() {
  const { photos, loading: photosLoading } = useRealtimePhotos()
  const { folders, loading: foldersLoading } = useRealtimeFolders()
  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadPhoto()
  const { mutateAsync: deletePhoto } = useDeletePhoto()
  const { mutateAsync: deleteFolder } = useDeleteFolder()
  const [createFolderOpen, setCreateFolderOpen] = useState(false)

  const loading = photosLoading || foldersLoading

  const handleUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map((file) =>
      uploadPhoto({ file })
    )

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

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId)
    } catch (error) {
      console.error("Delete folder error:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Photo Wall</h1>

      {/* Upload Section */}
      <PhotoUploadArea isUploading={isUploading} onUpload={handleUpload} />

      {/* Folders Section */}
      {folders.length > 0 && (
        <div className="space-y-2 pt-3">
          <FolderGrid
            folders={folders}
            photos={photos}
            onCreateFolder={() => setCreateFolderOpen(true)}
          />
        </div>
      )}

      {/* All Photos Section */}
      <div className="space-y-2">
        {photos.length > 0 ? (
          <PhotoGrid
            photos={photos}
            onRemovePhoto={handleRemovePhoto}
            folders={folders}
          />
        ) : !loading ? (
          <EmptyState />
        ) : null}
      </div>

      {loading && <LoadingState />}

      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
      />
    </div>
  )
}
