import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addCustomExpense } from "../services/add.service"
import type { CustomExpenseData } from "@/types"
import { toast } from "sonner"

export function useAddExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (customExpense: CustomExpenseData) => {
      const toastId = toast.loading("Adding expense...")
      try {
        const result = await addCustomExpense(customExpense)
        if (result.success) {
          toast.success("Expense added successfully", { id: toastId })
        } else {
          toast.error(result.error || "Failed to add expense", { id: toastId })
        }
        return result
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to add expense"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["expenses"] })
      }
    },
  })
}
