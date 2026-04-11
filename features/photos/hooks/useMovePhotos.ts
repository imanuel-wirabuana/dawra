"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { movePhotosToFolder } from "../services/movePhotos.service"
import { toast } from "sonner"

export function useMovePhotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ photoIds, folderId }: { photoIds: string[]; folderId: string | null }) => {
      const toastId = toast.loading(`Moving ${photoIds.length} photo${photoIds.length !== 1 ? "s" : ""}...`)
      try {
        await movePhotosToFolder(photoIds, folderId)
        toast.success(`Moved ${photoIds.length} photo${photoIds.length !== 1 ? "s" : ""}`, { id: toastId })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to move photos"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate and refetch photos queries
      queryClient.invalidateQueries({ queryKey: ["photos"] })
    },
    onError: (error) => {
      console.error("Move photos mutation error:", error)
    },
  })
}
