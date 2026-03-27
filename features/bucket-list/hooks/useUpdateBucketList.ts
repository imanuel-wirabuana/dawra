import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBucketList } from "../services/update.service"
import type { Category } from "@/types"

export function useUpdateBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
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
    }) =>
      updateBucketList({ id, title, description, cost, location, categories }),
    onSuccess: () => {
      // Invalidate and refetch bucket list queries
      queryClient.invalidateQueries({ queryKey: ["bucket-list"] })
    },
    onError: (error) => {
      console.error("Update mutation error:", error)
    },
  })
}
