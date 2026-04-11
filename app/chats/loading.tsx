import ChatsPanelSkeleton from "@/features/chats/components/ChatsPanelSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <ChatsPanelSkeleton />
    </div>
  )
}
