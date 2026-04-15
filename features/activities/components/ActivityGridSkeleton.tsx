import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ActivityGridSkeletonProps {
  className?: string
}

export function ActivityGridSkeleton({ className }: ActivityGridSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <Card className="overflow-hidden border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-3 py-3 sm:px-5 sm:py-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="divide-y divide-border/50 p-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start gap-4 px-4 py-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
