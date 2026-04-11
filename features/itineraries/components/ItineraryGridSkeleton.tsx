import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ItineraryGridSkeletonProps {
  className?: string
}

export default function ItineraryGridSkeleton({
  className,
}: ItineraryGridSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden border-border/60", className)}>
      <CardHeader className="border-b border-border/50 px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Time slots skeleton */}
        <div className="divide-y divide-border/50">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex">
              {/* Time column */}
              <div className="w-16 border-r border-border/50 py-4 pr-4 pl-4">
                <Skeleton className="h-4 w-10" />
              </div>
              {/* Content area */}
              <div className="flex-1 py-3 pr-4 pl-4">
                {index % 3 === 1 ? (
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Skeleton className="mb-2 h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-12 w-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
