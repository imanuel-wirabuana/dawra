import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateItineraryItem } from "../services/update.service"
import type { ItineraryItem } from "@/types"

export function useUpdateItineraryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<ItineraryItem, "id">>
    }) => updateItineraryItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itinerary"] })
    },
    onError: (error) => {
      console.error("Update mutation error:", error)
    },
  })
}
