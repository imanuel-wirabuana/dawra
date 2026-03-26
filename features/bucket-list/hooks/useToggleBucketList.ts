import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBucketListItem } from "../services/toggle.service"

export function useToggleBucketList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleBucketListItem({ id, completed }),
    onSuccess: () => {
      // Invalidate and refetch bucket list queries
      queryClient.invalidateQueries({ queryKey: ["bucket-list"] })
    },
    onError: (error) => {
      console.error("Toggle mutation error:", error)
    },
  })
}
