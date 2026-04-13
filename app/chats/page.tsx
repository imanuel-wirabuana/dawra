import ChatsPanel from "@/features/chats/components/ChatsPanel"
import { MessageCircle } from "lucide-react"

export default function Page() {
  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Chats</h1>
        </div>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          Connect and collaborate with your travel companions in real-time.
        </p>
      </div>
      <ChatsPanel />
    </div>
  )
}
