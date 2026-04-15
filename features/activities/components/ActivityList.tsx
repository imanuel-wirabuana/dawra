"use client"

import { ActivityItem } from "./ActivityItem"
import { useRealtimeActivities } from "../hooks/useRealtimeActivities"

export function ActivityList() {
  const { data: activities, isLoading, error } = useRealtimeActivities(50)

  if (isLoading) {
    return (
      <div className="divide-y divide-border/50">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-start gap-4 px-4 py-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Failed to load activities. Please try again.
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <svg
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">
          No activities yet. Actions you take will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border/50">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
