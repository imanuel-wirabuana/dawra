import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { subscribeActivities } from "../services/subscribe.service"
import type { Activity } from "@/types"

export function useRealtimeActivities(maxResults: number = 50) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<Activity[], Error>({
    queryKey: ["activities", "realtime", maxResults],
    queryFn: () =>
      new Promise((resolve) => {
        // Initial fetch will happen via subscription
        // Return empty array initially
        resolve([])
      }),
    staleTime: Infinity,
  })

  useEffect(() => {
    const unsubscribe = subscribeActivities(
      (activities) => {
        queryClient.setQueryData(
          ["activities", "realtime", maxResults],
          activities
        )
      },
      (error) => {
        console.error("Activities subscription error:", error)
      },
      maxResults
    )

    return () => unsubscribe()
  }, [queryClient, maxResults])

  return { data: data ?? [], isLoading, error }
}
