import type { Photo } from "@/types"

export async function deletePhoto(photoId: string): Promise<void> {
  try {
    const response = await fetch(`/api/v1/photos/${photoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || errorData.message || "Failed to delete photo"
      )
    }
  } catch (error) {
    console.error("Error deleting photo:", error)
    throw error
  }
}
