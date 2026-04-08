import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBucketListItem } from "../services/toggle.service"
import { toast } from "sonner"

export function useToggleBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string
      completed: boolean
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
