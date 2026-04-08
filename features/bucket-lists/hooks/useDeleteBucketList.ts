import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBucketListItem } from "../services/delete.service"
import { toast } from "sonner"

export function useDeleteBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const toastId = toast.loading("Deleting item...")
      try {
        const result = await deleteBucketListItem(id)
        if (result.success) {
          toast.success("Item deleted successfully", { id: toastId })
        } else {
          toast.error(result.error || "Failed to delete item", { id: toastId })
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete item"
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
      console.error("Delete mutation error:", error)
    },
  })
}
