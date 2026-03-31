import type { Photo } from "@/types"

export async function getRandomizedPhotos(
  limit: number = 50
): Promise<Photo[]> {
  try {
    const response = await fetch("/api/v1/photos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch photos")
    }

    const result = await response.json()
    const data: Photo[] = result.data || []

    // Shuffle photos randomly
    const shuffled = [...data].sort(() => Math.random() - 0.5)

    // Return limited number
    return shuffled.slice(0, limit)
  } catch (error) {
    console.error("Error fetching photos:", error)
    throw error
  }
}
