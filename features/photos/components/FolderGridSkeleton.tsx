"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FolderGridSkeletonProps {
  className?: string
  count?: number
}

export default function FolderGridSkeleton({
  className,
  count = 4,
}: FolderGridSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="overflow-hidden border-border/50 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
