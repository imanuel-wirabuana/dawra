import PhotoGridSkeleton from "@/features/photos/components/PhotoGridSkeleton"
import FolderGridSkeleton from "@/features/photos/components/FolderGridSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>

      {/* Upload Section Skeleton */}
      <Skeleton className="h-32 w-full rounded-lg" />

      {/* Folders Section Skeleton */}
      <div className="mt-6">
        <FolderGridSkeleton />
      </div>

      {/* Photos Section Skeleton */}
      <div className="mt-6">
        <PhotoGridSkeleton />
      </div>
    </div>
  )
}
