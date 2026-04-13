import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ChatsPanelSkeletonProps {
  className?: string
}

export default function ChatsPanelSkeleton({
  className,
}: ChatsPanelSkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-[calc(100vh-14rem)] min-h-96 flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-b from-muted/50 to-muted/20 px-3 py-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-7 w-48 rounded-md" />
      </div>

      {/* Messages area */}
      <div className="min-h-0 flex-1 p-3">
        <div className="space-y-4">
          {/* Incoming message */}
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="max-w-[80%] flex-1">
              <Skeleton className="h-16 w-48 rounded-2xl rounded-tl-sm" />
            </div>
          </div>

          {/* Outgoing message */}
          <div className="flex flex-row-reverse gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="max-w-[80%] flex-1 text-right">
              <Skeleton className="ml-auto h-12 w-40 rounded-2xl rounded-tr-sm" />
            </div>
          </div>

          {/* Incoming message */}
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="max-w-[80%] flex-1">
              <Skeleton className="h-20 w-64 rounded-2xl rounded-tl-sm" />
            </div>
          </div>

          {/* Outgoing message */}
          <div className="flex flex-row-reverse gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="max-w-[80%] flex-1 text-right">
              <Skeleton className="ml-auto h-14 w-52 rounded-2xl rounded-tr-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-2 border-t border-border/50 bg-gradient-to-b from-muted/30 to-muted/5 p-3">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 shrink-0" />
          <div className="flex flex-1 gap-1.5">
            <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-7 w-20" />
        </div>
      </div>
    </div>
  )
}
