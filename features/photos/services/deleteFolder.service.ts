export async function deleteFolder(folderId: string) {
  try {
    const response = await fetch(`/api/v1/folders/${folderId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete folder")
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting folder:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
