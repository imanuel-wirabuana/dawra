import type { BucketList } from "@/types"

// Helper to safely get Date from createdAt (supports Firestore Timestamp, string, or Date)
function getCreatedAtTime(item: BucketList): number {
  const createdAt = item.createdAt
  if (!createdAt) return 0

  // Firestore Timestamp with toDate()
  if (
    typeof createdAt === "object" &&
    "toDate" in createdAt &&
    typeof createdAt.toDate === "function"
  ) {
    return createdAt.toDate().getTime()
  }

  // String or already a Date
  return new Date(createdAt as unknown as string | Date).getTime()
}

export async function getBucketLists(): Promise<BucketList[]> {
  try {
    const response = await fetch("/api/v1/bucket-lists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch bucket lists")
    }

    const data = await response.json()
    return data.data.sort(
      (a: BucketList, b: BucketList) =>
        getCreatedAtTime(b) - getCreatedAtTime(a)
    )
  } catch (error) {
    console.error("Error fetching bucket lists:", error)
    throw error
  }
}
