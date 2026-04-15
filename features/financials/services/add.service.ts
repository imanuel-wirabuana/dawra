import type { Transaction } from "@/types"

export async function addTransaction(
  transaction: Omit<Transaction, "id">
): Promise<void> {
  try {
    const response = await fetch("/api/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to add transaction")
    }
  } catch (error) {
    console.error("Error adding transaction:", error)
    throw error
  }
}
