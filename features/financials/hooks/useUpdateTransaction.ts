import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTransaction } from "../services/update.service"
import type { Transaction } from "@/types"

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<Transaction, "id">>
    }) => updateTransaction(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
