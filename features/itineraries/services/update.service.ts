import type { ItineraryItem } from "@/types"

export async function updateItineraryItem(
  id: string,
  updates: Partial<Omit<ItineraryItem, "id">>
) {
  try {
    const response = await fetch(`/api/v1/itineraries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update item")
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating itinerary item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
