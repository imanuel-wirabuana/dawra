"use client"

import { formatDistanceToNow } from "date-fns"
import { Activity } from "@/types"
import { cn } from "@/lib/utils"
import {
  Wallet,
  Calendar,
  Target,
  History,
  Image,
  type LucideIcon,
} from "lucide-react"

interface ActivityItemProps {
  activity: Activity
}

const iconMap: Record<string, LucideIcon> = {
  transaction: Wallet,
  itinerary: Calendar,
  "bucket-list": Target,
  photo: Image,
  default: History,
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const timestamp = activity.createdAt?.toDate
    ? activity.createdAt.toDate()
    : null

  const Icon = iconMap[activity.entity] || iconMap.default
  const isCompleteAction =
    activity.type.includes("complete") || activity.type.includes("delete")

  return (
    <div className="group flex items-start gap-3 px-4 py-4 transition-colors hover:bg-muted/30">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isCompleteAction
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {activity.message}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>
          )}

          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <span className="text-xs text-muted-foreground/70">
              {formatMetadata(activity.metadata)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function formatMetadata(metadata: Record<string, unknown>): string {
  const entries = Object.entries(metadata)
    .filter(([, value]) => typeof value !== "object" && value !== undefined)
    .slice(0, 2)
    .map(([key, value]) => {
      // Format key: amount -> Amount, date -> Date
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
      return `${formattedKey}: ${value}`
    })

  return entries.join(" • ")
}
