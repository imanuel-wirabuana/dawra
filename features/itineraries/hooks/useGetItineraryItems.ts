import { useQuery } from "@tanstack/react-query"
import { getItineraryItems } from "../services/get.service"
import type { ItineraryItem } from "@/types"

export function useGetItineraryItems() {
  return useQuery<ItineraryItem[]>({
    queryKey: ["itinerary"],
    queryFn: getItineraryItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
