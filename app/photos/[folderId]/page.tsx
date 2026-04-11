"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, FolderOpen, Trash2, X } from "lucide-react"
import { useDeleteFolder } from "@/features/photos/hooks/useDeleteFolder"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useRealtimePhotosByFolder } from "@/features/photos/hooks/useRealtimePhotosByFolder"
import { useRealtimeFolders } from "@/features/photos/hooks/useRealtimeFolders"
import { useDeletePhoto } from "@/features/photos/hooks/useDeletePhoto"
import { useUploadPhoto } from "@/features/photos/hooks/useUploadPhoto"
import PhotoUploadArea from "@/features/photos/components/PhotoUploadArea"
import PhotoGrid from "@/features/photos/components/PhotoGrid"
import EmptyState from "@/features/photos/components/EmptyState"
import LoadingState from "@/features/photos/components/LoadingState"
import { Button } from "@/components/ui/button"

interface FolderPageProps {
  params: Promise<{ folderId: string }>
}

export default function FolderPage({ params }: FolderPageProps) {
  const { folderId } = use(params)
  const { photos, loading: photosLoading } = useRealtimePhotosByFolder(folderId)
  const { folders, loading: foldersLoading } = useRealtimeFolders()
  const { mutateAsync: deletePhoto } = useDeletePhoto()
  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadPhoto()

  const loading = photosLoading || foldersLoading

  const handleUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map((file) =>
      uploadPhoto({ file, folderId })
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

  const { mutateAsync: deleteFolder } = useDeleteFolder()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const folder = folders.find((f) => f.id === folderId)

  const handleDeleteFolder = async () => {
    try {
      await deleteFolder(folderId)
      setDeleteDialogOpen(false)
      window.location.href = "/photos"
    } catch (error) {
      console.error("Delete folder error:", error)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/photos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">{folder?.name || "Folder"}</h1>
              {folder?.description && (
                <p className="text-sm text-muted-foreground">
                  {folder.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {photos.length} photos
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete folder
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <PhotoUploadArea isUploading={isUploading} onUpload={handleUpload} />
        <div>
          {photos.length > 0 && (
            <PhotoGrid
              photos={photos}
              onRemovePhoto={handleRemovePhoto}
              folders={folders}
              currentFolderId={folderId}
            />
          )}
          {photos.length === 0 && !loading && (
            <EmptyState message="This folder is empty. Upload some photos!" />
          )}
          {loading && <LoadingState />}
        </div>
      </div>

      {/* Delete Folder Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete &quot;{folder?.name}&quot;. Photos inside this
              folder will NOT be deleted - they will remain in your photo
              library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="gap-1.5">
              <X className="h-4 w-4" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              className="gap-1.5 text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
