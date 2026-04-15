import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBucketListItem } from "../services/toggle.service"
import { addActivity } from "@/features/activities/services/add.service"
import { toast } from "sonner"

export function useToggleBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      completed,
      title,
    }: {
      id: string
      completed: boolean
      title?: string
    }) => {
      const toastId = toast.loading(
        completed ? "Completing item..." : "Uncompleting item..."
      )
      try {
        const result = await toggleBucketListItem({ id, completed })
        if (result.success) {
          toast.success(completed ? "Item completed" : "Item uncompleted", {
            id: toastId,
          })

          // Log activity when completing (non-blocking)
          if (completed) {
            addActivity({
              type: "bucket.complete",
              entity: "bucket-list",
              entityId: id,
              message: title
                ? `Completed bucket list: ${title}`
                : "Completed bucket list",
              metadata: {},
            }).catch(() => {
              // Ignore errors - activities are non-blocking
            })
          }
        } else {
          toast.error(result.error || "Failed to update item", { id: toastId })
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update item"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch bucket list queries
        queryClient.invalidateQueries({ queryKey: ["bucket-list"] })
      }
    },
    onError: (error) => {
      console.error("Toggle mutation error:", error)
    },
  })
}
