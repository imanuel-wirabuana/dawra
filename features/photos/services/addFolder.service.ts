import type { Folder } from "@/types"

export async function addFolder(folder: Omit<Folder, "id">) {
  try {
    const response = await fetch("/api/v1/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(folder),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to add folder")
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    console.error("Error adding folder:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
