import type { ItineraryItem } from "@/types"

export async function getItineraryItems(): Promise<ItineraryItem[]> {
  try {
    const response = await fetch("/api/v1/itinerary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch itinerary items")
    }

    const data = await response.json()
    return data.data.sort(
      (a: ItineraryItem, b: ItineraryItem) =>
        new Date(a.start).getTime() - new Date(b.start).getTime()
    )
  } catch (error) {
    console.error("Error fetching itinerary items:", error)
    throw error
  }
}
