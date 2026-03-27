import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addItineraryItem } from "../services/add.service"
import type { ItineraryItem } from "@/types"

export function useAddItineraryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (item: Omit<ItineraryItem, "id">) =>
      addItineraryItem(item),
    onSuccess: () => {
      // Invalidate and refetch itinerary queries
      queryClient.invalidateQueries({ queryKey: ["itinerary"] })
    },
    onError: (error) => {
      console.error("Mutation error:", error)
    },
  })
}
