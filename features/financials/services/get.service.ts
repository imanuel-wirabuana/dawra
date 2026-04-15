import type { Transaction } from "@/types"

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch("/api/v1/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch transactions")
    }

    const data = await response.json()
    return data.data.sort(
      (a: Transaction, b: Transaction) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

export async function getTransactionsByMonth(month: string): Promise<Transaction[]> {
  try {
    const response = await fetch(`/api/v1/transactions?month=${encodeURIComponent(month)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch transactions")
    }

    const data = await response.json()
    return data.data.sort(
      (a: Transaction, b: Transaction) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}
