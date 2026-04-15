export async function deleteTransaction(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/v1/transactions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete transaction")
    }
  } catch (error) {
    console.error("Error deleting transaction:", error)
    throw error
  }
}
