import { useQuery } from "@tanstack/react-query"
import { getActivities } from "../services/get.service"

export function useGetActivities(maxResults: number = 50) {
  return useQuery({
    queryKey: ["activities", maxResults],
    queryFn: () => getActivities(maxResults),
  })
}
