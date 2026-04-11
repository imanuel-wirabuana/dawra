import BucketListGridSkeleton from "@/features/bucket-lists/components/BucketListGridSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="order-2 w-full lg:order-1 lg:w-[70%]">
          <BucketListGridSkeleton />
        </div>
        <div className="order-1 w-full lg:order-2 lg:block lg:w-[30%]">
          <div className="rounded-lg border border-border/50 bg-card p-4 shadow-sm">
            <Skeleton className="mb-4 h-6 w-3/4" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
