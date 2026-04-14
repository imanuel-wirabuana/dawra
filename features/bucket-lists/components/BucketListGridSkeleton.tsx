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
        <div
          key={index}
          className="rounded-xl border border-border/40 bg-linear-to-b from-muted/50 to-muted/20 p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <Skeleton className="mb-2 h-3.5 w-full" />
          <Skeleton className="mb-3 h-3.5 w-2/3" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3.5 w-14" />
          </div>
        </div>
      ))}
    </div>
  )
}
