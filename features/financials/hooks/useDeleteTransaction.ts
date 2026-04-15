import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTransaction } from "../services/delete.service"
import { addActivity } from "@/features/activities/services/add.service"

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTransaction(id)

      // Log activity (non-blocking)
      addActivity({
        type: "transaction.delete",
        entity: "transaction",
        entityId: id,
        message: "Deleted transaction",
        metadata: {},
      }).catch(() => {
        // Ignore errors - activities are non-blocking
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
