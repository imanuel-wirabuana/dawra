import PhotoGridSkeleton from "@/features/photos/components/PhotoGridSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div>
              <Skeleton className="mb-1 h-7 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <PhotoGridSkeleton />
      </div>
    </div>
  )
}
