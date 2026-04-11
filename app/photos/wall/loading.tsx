import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container">
      <div className="mb-4 flex flex-col items-center justify-end gap-4 lg:flex-row">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-36" />
      </div>
      <Skeleton className="mb-4 h-4 w-64" />

      {/* Photo wall grid skeleton */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton
            key={index}
            className="aspect-square rounded-lg"
            style={{
              gridColumn: index % 4 === 0 ? "span 2" : undefined,
              gridRow: index % 4 === 0 ? "span 2" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}
