import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBucketListItem } from "../services/delete.service"

export function useDeleteBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBucketListItem(id),
    onSuccess: () => {
      // Invalidate and refetch bucket list queries
      queryClient.invalidateQueries({ queryKey: ["bucket-list"] })
    },
    onError: (error) => {
      console.error("Delete mutation error:", error)
    },
  })
}
