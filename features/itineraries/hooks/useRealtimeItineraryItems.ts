import { useEffect, useState } from "react"
import { subscribeToItineraryItems } from "../services/subscribe.service"
import type { ItineraryItem } from "@/types"

export function useRealtimeItineraryItems() {
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToItineraryItems((data) => {
      // Sort by date, return ALL items
      const sortedData = data.sort(
        (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
      )
      setItineraryItems(sortedData as ItineraryItem[])
    })

    return unsubscribe
  }, [])

  return itineraryItems
}
