import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleExpenseInclude } from "../services/update.service"
import type { Expense } from "@/types"
import { toast } from "sonner"

export function useToggleExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      expenseId,
      currentInclude,
      expenseData,
    }: {
      expenseId: string
      currentInclude: boolean | undefined
      expenseData?: Partial<Expense>
    }) => {
      const result = await toggleExpenseInclude(expenseId, currentInclude, expenseData)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      toast.success("Expense updated")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update expense")
    },
  })
}
