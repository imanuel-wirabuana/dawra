import type { Photo } from "@/types"

export async function getPhotos(): Promise<Photo[]> {
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

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching photos:", error)
    throw error
  }
}
