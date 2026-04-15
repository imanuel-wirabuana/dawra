"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteFolder } from "../services/deleteFolder.service"
import { addActivity } from "@/features/activities/services/add.service"
import { toast } from "sonner"

export function useDeleteFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (folderId: string) => {
      const toastId = toast.loading("Deleting folder...")
      try {
        const result = await deleteFolder(folderId)
        if (result.success) {
          toast.success("Folder deleted", { id: toastId })

          // Log activity (non-blocking)
          addActivity({
            type: "folder.delete",
            entity: "folder",
            entityId: folderId,
            message: "Deleted folder",
            metadata: {},
          }).catch(() => {
            // Ignore errors - activities are non-blocking
          })
        } else {
          toast.error(result.error || "Failed to delete folder", {
            id: toastId,
          })
          throw new Error(result.error || "Failed to delete folder")
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete folder"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    },
  })
}
