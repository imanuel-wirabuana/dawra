import ChatsPanel from "@/features/chats/components/ChatsPanel"
import { MessageCircle } from "lucide-react"

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Chats</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect and collaborate with your travel companions in real-time.
        </p>
      </div>
      <ChatsPanel />
    </div>
  )
}
