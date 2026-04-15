import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePhoto } from "../services/delete.service"
import { addActivity } from "@/features/activities/services/add.service"
import { toast } from "sonner"

export function useDeletePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (photoId: string) => {
      const toastId = toast.loading("Deleting photo...")
      try {
        await deletePhoto(photoId)
        toast.success("Photo deleted", { id: toastId })

        // Log activity (non-blocking)
        addActivity({
          type: "photo.delete",
          entity: "photo",
          entityId: photoId,
          message: "Deleted photo",
          metadata: {},
        }).catch(() => {
          // Ignore errors - activities are non-blocking
        })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete photo"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] })
    },
    onError: (error) => {
      console.error("Delete photo error:", error)
    },
  })
}
