import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addTransaction } from "../services/add.service"
import { addActivity } from "@/features/activities/services/add.service"
import type { Transaction } from "@/types"

export function useAddTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, "id">) => {
      const result = await addTransaction(transaction)

      // Log activity (non-blocking)
      addActivity({
        type: "transaction.create",
        entity: "transaction",
        entityId: result.id,
        message: `Created transaction: ${transaction.title}`,
        metadata: {
          amount: transaction.amount,
          date: transaction.date,
          type: transaction.type,
        },
      }).catch(() => {
        // Ignore errors - activities are non-blocking
      })

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
