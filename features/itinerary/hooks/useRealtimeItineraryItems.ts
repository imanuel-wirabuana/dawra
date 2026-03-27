import { useEffect, useState } from "react"
import { subscribeToItineraryItems } from "../services/subscribe.service"
import { useItineraryStore } from "@/store/itineraryStore"
import type { ItineraryItem } from "@/types"

export function useRealtimeItineraryItems() {
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([])
  const { selectedDate } = useItineraryStore()

  useEffect(() => {
    const unsubscribe = subscribeToItineraryItems((data) => {
      // Filter items by selected date and sort by start time
      const filteredData = data
        .filter((item) => {
          const itemDate = new Date(item.start!).toDateString()
          const filterDate = selectedDate.toDateString()
          return itemDate === filterDate
        })
        .sort(
          (a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime()
        )
      setItineraryItems(filteredData as ItineraryItem[])
    })

    return unsubscribe
  }, [selectedDate])

  return itineraryItems
}
