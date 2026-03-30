import type { Photo } from "@/types"

export async function uploadPhoto(file: File): Promise<Photo> {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch("/api/v1/photos", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Upload failed for ${file.name}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error uploading photo:", error)
    throw error
  }
}
