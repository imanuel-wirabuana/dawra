import type { BucketList } from "@/types"

export async function addBucketList(
  item: Omit<BucketList, "id" | "createdAt" | "updatedAt">
) {
  try {
    const response = await fetch("/api/v1/bucket-lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to add item")
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    console.error("Error adding bucket list item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
