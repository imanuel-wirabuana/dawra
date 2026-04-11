import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface BucketListGridSkeletonProps {
  className?: string
  count?: number
}

export default function BucketListGridSkeleton({
  className,
  count = 6,
}: BucketListGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border border-border/50 bg-card p-4 shadow-sm">
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-2/3" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
