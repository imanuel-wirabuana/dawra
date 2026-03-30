import type { ItineraryItem } from "@/types"

export async function addItineraryItem(item: Omit<ItineraryItem, "id">) {
  try {
    const response = await fetch("/api/v1/itineraries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to add itinerary item")
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    console.error("Error adding itinerary item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
