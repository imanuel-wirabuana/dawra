import type { Transaction } from "@/types"

export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, "id">>
): Promise<void> {
  try {
    const response = await fetch(`/api/v1/transactions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update transaction")
    }
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
}
