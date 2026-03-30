import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addBucketList } from "../services/add.service"
import type { BucketList } from "@/types"

export function useAddBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (item: Omit<BucketList, "id" | "createdAt" | "updatedAt">) =>
      addBucketList(item),
    onSuccess: () => {
      // Invalidate and refetch bucket list queries
      queryClient.invalidateQueries({ queryKey: ["bucket-list"] })
    },
    onError: (error) => {
      console.error("Mutation error:", error)
    },
  })
}
