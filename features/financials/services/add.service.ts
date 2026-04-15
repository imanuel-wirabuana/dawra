import type { Transaction } from "@/types"

export async function addTransaction(
  transaction: Omit<Transaction, "id">
): Promise<{ id: string }> {
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

    const result = await response.json()
    return { id: result.data.id }
  } catch (error) {
    console.error("Error adding transaction:", error)
    throw error
  }
}
