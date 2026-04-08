import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addItineraryItem } from "../services/add.service"
import type { ItineraryItem } from "@/types"
import { toast } from "sonner"

export function useAddItineraryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: Omit<ItineraryItem, "id">) => {
      const toastId = toast.loading("Adding itinerary item...")
      try {
        const result = await addItineraryItem(item)
        if (result.success) {
          toast.success("Itinerary item added", { id: toastId })
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
        // Invalidate and refetch itinerary queries
        queryClient.invalidateQueries({ queryKey: ["itinerary"] })
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error)
    },
  })
}
