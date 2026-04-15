"use client"

import { useEffect, useState } from "react"
import { subscribeToTransactions } from "../services/subscribe.service"
import type { Transaction } from "@/types"

export function useRealtimeTransactions(month?: string): Transaction[] {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToTransactions((data: Transaction[]) => {
      // Filter by month if provided
      if (month) {
        const monthData = data.filter((t) => {
          const tDate = new Date(t.date)
          const mDate = new Date(month)
          return (
            tDate.getMonth() === mDate.getMonth() &&
            tDate.getFullYear() === mDate.getFullYear()
          )
        })
        setTransactions(monthData)
      } else {
        setTransactions(data)
      }
    })

    return () => unsubscribe()
  }, [month])

  return transactions
}
