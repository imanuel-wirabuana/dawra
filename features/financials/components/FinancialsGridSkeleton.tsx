import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface FinancialsGridSkeletonProps {
  className?: string
}

export default function FinancialsGridSkeleton({
  className,
}: FinancialsGridSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-border/60">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Card Skeleton */}
      <Card className="overflow-hidden border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Itinerary items skeleton */}
          <div className="divide-y divide-border/50">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-9 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Transaction Form Skeleton */}
      <Card className="overflow-hidden border-border/60">
        <CardHeader className="px-4 py-4">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>

      {/* Custom Transactions List Skeleton */}
      <Card className="overflow-hidden border-border/60">
        <CardHeader className="px-4 py-4">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="divide-y divide-border/50 px-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
