import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTransaction } from "../services/update.service"
import { addActivity } from "@/features/activities/services/add.service"
import type { Transaction } from "@/types"

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<Transaction, "id">>
    }) => {
      await updateTransaction(id, updates)

      // Log activity (non-blocking)
      addActivity({
        type: "transaction.update",
        entity: "transaction",
        entityId: id,
        message: `Updated transaction: ${updates.title || id}`,
        metadata: {
          amount: updates.amount,
          date: updates.date,
          type: updates.type,
        },
      }).catch(() => {
        // Ignore errors - activities are non-blocking
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
