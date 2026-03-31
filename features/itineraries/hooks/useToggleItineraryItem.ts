import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleItineraryItem } from "../services/toggle.service"

export function useToggleItineraryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleItineraryItem({ id, completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itinerary"] })
    },
    onError: (error) => {
      console.error("Toggle mutation error:", error)
    },
  })
}
