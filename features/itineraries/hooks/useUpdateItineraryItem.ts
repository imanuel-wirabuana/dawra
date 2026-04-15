import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateItineraryItem } from "../services/update.service"
import { addActivity } from "@/features/activities/services/add.service"
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

          // Log activity (non-blocking)
          addActivity({
            type: "itinerary.update",
            entity: "itinerary",
            entityId: id,
            message: "Updated itinerary schedule",
            metadata: {
              date: updates.date,
              start: updates.start,
              end: updates.end,
            },
          }).catch(() => {
            // Ignore errors - activities are non-blocking
          })
        } else {
          toast.error(result.error || "Failed to update item", { id: toastId })
          throw new Error(result.error || "Failed to update item")
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update item"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["itinerary"] })

      // Snapshot previous value for rollback
      const previousItems = queryClient.getQueryData<ItineraryItem[]>([
        "itinerary",
      ])

      // Optimistically update the cache
      queryClient.setQueryData<ItineraryItem[]>(["itinerary"], (old) => {
        if (!old) return old
        return old.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      })

      return { previousItems }
    },
    onError: (err, _, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(["itinerary"], context.previousItems)
      }
      console.error("Update mutation error:", err)
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["itinerary"] })
    },
  })
}
