import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBucketList } from "../services/update.service"

export function useUpdateBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
      location,
    }: {
      id: string
      title: string
      description: string
      location?: string
    }) => updateBucketList({ id, title, description, location }),
    onSuccess: () => {
      // Invalidate and refetch bucket list queries
      queryClient.invalidateQueries({ queryKey: ["bucket-list"] })
    },
    onError: (error) => {
      console.error("Update mutation error:", error)
    },
  })
}
