import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBucketList } from "../services/update.service"
import { addActivity } from "@/features/activities/services/add.service"
import type { Category } from "@/types"
import { toast } from "sonner"

export function useUpdateBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      cost,
      location,
      categories,
    }: {
      id: string
      title: string
      description: string
      cost?: number
      location?: string
      categories?: Category[]
    }) => {
      const toastId = toast.loading("Updating item...")
      try {
        const result = await updateBucketList({
          id,
          title,
          description,
          cost,
          location,
          categories,
        })
        if (result.success) {
          toast.success("Item updated successfully", { id: toastId })

          // Log activity (non-blocking)
          addActivity({
            type: "bucket.update",
            entity: "bucket-list",
            entityId: id,
            message: `Updated bucket list: ${title}`,
            metadata: {
              cost,
              location,
            },
          }).catch(() => {
            // Ignore errors - activities are non-blocking
          })
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
      console.error("Update mutation error:", error)
    },
  })
}
