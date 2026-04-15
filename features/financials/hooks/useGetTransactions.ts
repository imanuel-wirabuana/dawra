import { useQuery } from "@tanstack/react-query"
import { getTransactions, getTransactionsByMonth } from "../services/get.service"
import type { Transaction } from "@/types"

export function useGetTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useGetTransactionsByMonth(month: string) {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", "month", month],
    queryFn: () => getTransactionsByMonth(month),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!month,
  })
}
