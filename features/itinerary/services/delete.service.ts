export async function deleteItineraryItem(id: string) {
  try {
    const response = await fetch(`/api/v1/itinerary/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete item")
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting itinerary item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
