"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface PhotoGridSkeletonProps {
  className?: string
  count?: number
}

export default function PhotoGridSkeleton({
  className,
  count = 8,
}: PhotoGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="group relative aspect-square overflow-hidden rounded-xl border border-border/40 shadow-sm"
        >
          <Skeleton className="h-full w-full" />
          {/* Hover overlay skeleton */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      ))}
    </div>
  )
}
