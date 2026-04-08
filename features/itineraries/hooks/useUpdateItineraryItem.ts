import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateItineraryItem } from "../services/update.service"
import type { ItineraryItem } from "@/types"
import { toast } from "sonner"

export function useUpdateItineraryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<ItineraryItem, "id">>
    }) => {
      const toastId = toast.loading("Updating item...")
      try {
        const result = await updateItineraryItem(id, updates)
        if (result.success) {
          toast.success("Item updated successfully", { id: toastId })
        } else {
          toast.error(result.error || "Failed to update item", { id: toastId })
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update item"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["itinerary"] })
      }
    },
    onError: (error) => {
      console.error("Update mutation error:", error)
    },
  })
}
