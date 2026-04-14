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
import { LayoutGrid, Camera, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

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
    <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 sm:mb-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/20 to-violet-500/10 shadow-sm">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Photos
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Memories we capture together
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/photos/wall">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-full border-border/60 text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
              >
                <LayoutGrid className="h-4 w-4" />
                Wall View
              </Button>
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-4 py-2 backdrop-blur-sm">
              <Images className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Memories
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upload Section */}
      <PhotoUploadArea isUploading={isUploading} onUpload={handleUpload} />

      {/* Folders Section */}
      <div className="mt-6">
        <FolderGrid
          folders={folders}
          photos={photos}
          onCreateFolder={() => setCreateFolderOpen(true)}
        />
      </div>

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
