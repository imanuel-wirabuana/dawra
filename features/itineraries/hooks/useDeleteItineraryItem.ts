"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteItineraryItem } from "../services/delete.service"
import { addActivity } from "@/features/activities/services/add.service"
import { toast } from "sonner"

export function useDeleteItineraryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const toastId = toast.loading("Deleting itinerary item...")
      try {
        const result = await deleteItineraryItem(id)
        if (result.success) {
          toast.success("Itinerary item deleted", { id: toastId })

          // Log activity (non-blocking)
          addActivity({
            type: "itinerary.delete",
            entity: "itinerary",
            entityId: id,
            message: "Deleted itinerary",
            metadata: {},
          }).catch(() => {
            // Ignore errors - activities are non-blocking
          })
        } else {
          toast.error(result.error || "Failed to delete item", { id: toastId })
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete item"
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
      console.error("Delete mutation error:", error)
    },
  })
}
