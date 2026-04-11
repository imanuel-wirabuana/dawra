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
import { LayoutGrid, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

export default function PhotoWall() {
  const { photos, loading: photosLoading } = useRealtimePhotos()
  const { folders, loading: foldersLoading } = useRealtimeFolders()
  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadPhoto()
  const { mutateAsync: deletePhoto } = useDeletePhoto()
  const { mutateAsync: deleteFolder } = useDeleteFolder()
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(true)

  const loading = photosLoading || foldersLoading

  const filteredPhotos = showUnassignedOnly
    ? photos.filter((p) => !p.folderId)
    : photos

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
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Photos</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize your travel memories into folders and albums.
          </p>
        </div>
        <Link href="/photos/wall">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-border/60 text-xs font-medium transition-all duration-150 hover:border-primary/50 hover:bg-primary/5"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Wall View
          </Button>
        </Link>
      </div>

      {/* Upload Section */}
      <PhotoUploadArea isUploading={isUploading} onUpload={handleUpload} />

      {/* Folders Section */}
      {folders.length > 0 && (
        <div className="mt-6">
          <FolderGrid
            folders={folders}
            photos={photos}
            onCreateFolder={() => setCreateFolderOpen(true)}
          />
        </div>
      )}

      {/* Unassigned Photos Section */}
      <div className="mt-6">
        {filteredPhotos.length > 0 ? (
          <PhotoGrid
            photos={filteredPhotos}
            onRemovePhoto={handleRemovePhoto}
            folders={folders}
            showUnassignedOnly={showUnassignedOnly}
            onToggleFilter={() => setShowUnassignedOnly(!showUnassignedOnly)}
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
