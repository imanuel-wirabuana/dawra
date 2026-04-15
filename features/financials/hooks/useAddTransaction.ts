import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addTransaction } from "../services/add.service"
import type { Transaction } from "@/types"

export function useAddTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transaction: Omit<Transaction, "id">) =>
      addTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
