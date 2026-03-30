import type { BucketList } from "@/types"

export async function toggleBucketListItem({
  id,
  completed,
}: {
  id: string
  completed: boolean
}) {
  try {
    const response = await fetch(`/api/v1/bucket-lists/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update item")
    }

    return { success: true }
  } catch (error) {
    console.error("Error toggling bucket list item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
