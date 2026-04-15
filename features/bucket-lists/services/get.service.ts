import type { BucketList } from "@/types"

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
        new Date(b.createdAt?.toDate() ?? 0).getTime() -
        new Date(a.createdAt?.toDate() ?? 0).getTime()
    )
  } catch (error) {
    console.error("Error fetching bucket lists:", error)
    throw error
  }
}
