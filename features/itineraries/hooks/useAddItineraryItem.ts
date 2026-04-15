import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addItineraryItem } from "../services/add.service"
import { addActivity } from "@/features/activities/services/add.service"
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

          // Log activity (non-blocking)
          const title =
            item.itemType === "bucket-list"
              ? item.bucketList
              : item.customItem?.title || "New itinerary"
          addActivity({
            type: "itinerary.create",
            entity: "itinerary",
            entityId: result.id || "",
            message: `Created itinerary: ${title}`,
            metadata: {
              date: item.date,
              start: item.start,
              end: item.end,
              itemType: item.itemType,
            },
          }).catch(() => {
            // Ignore errors - activities are non-blocking
          })
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
