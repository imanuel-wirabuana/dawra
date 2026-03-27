import type { BucketList, Category } from "@/types"

export async function updateBucketList({
  id,
  title,
  description,
  cost,
  location,
  categories,
}: {
  id: string
  title: string
  description: string
  cost?: number
  location?: string
  categories?: Category[]
}) {
  try {
    const response = await fetch(`/api/v1/bucket-list/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, cost, location, categories }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update item")
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating bucket list item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
