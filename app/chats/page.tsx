import ChatsPanel from "@/features/chats/components/ChatsPanel"

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Chats</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect and collaborate with your travel companions in real-time.
        </p>
      </div>
      <ChatsPanel />
    </div>
  )
}
