import type { Folder } from "@/types"

export async function getFolders(): Promise<Folder[]> {
  try {
    const response = await fetch("/api/v1/folders")
    if (!response.ok) {
      throw new Error("Failed to fetch folders")
    }
    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching folders:", error)
    return []
  }
}
