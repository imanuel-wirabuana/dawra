import { cn } from "@/lib/utils"

interface BucketListGridSkeletonProps {
  className?: string
}

export default function BucketListGridSkeleton({
  className,
}: BucketListGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-lg border p-4 shadow-sm">
          <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
