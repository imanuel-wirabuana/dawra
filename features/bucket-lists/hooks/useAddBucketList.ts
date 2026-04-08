import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addBucketList } from "../services/add.service"
import type { BucketList } from "@/types"
import { toast } from "sonner"

export function useAddBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      item: Omit<BucketList, "id" | "createdAt" | "updatedAt">
    ) => {
      const toastId = toast.loading("Adding item...")
      try {
        const result = await addBucketList(item)
        if (result.success) {
          toast.success("Item added successfully", { id: toastId })
        } else {
          toast.error(result.error || "Failed to add item", { id: toastId })
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to add item"
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
      console.error("Mutation error:", error)
    },
  })
}
