"use client"

import { useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAddChatMessage } from "../hooks/useAddChatMessage"
import { useRealtimeChats } from "../hooks/useRealtimeChats"

export default function ChatsPanel() {
  const { messages, loading } = useRealtimeChats()
  const addChatMessage = useAddChatMessage()
  const [displayName, setDisplayName] = useState("")
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await addChatMessage.mutateAsync({
        displayName: displayName.trim() || "Guest",
        message,
      })
      setMessage("")
    } catch (error) {
      console.error("Failed to send chat message:", error)
    }
  }

  return (
    <Card className="border-0 bg-linear-to-br from-background to-muted/20 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Chats</CardTitle>
        <p className="text-sm text-muted-foreground">
          Simple realtime chat. No login required yet — just type a name and a
          message.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-[60vh] space-y-3 overflow-y-auto rounded-xl border border-border bg-background/70 p-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          ) : messages.length > 0 ? (
            messages.map((item) => (
              <div
                key={item.id}
                className="max-w-[85%] rounded-2xl bg-muted/70 px-4 py-3"
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.displayName}</p>
                  <span className="text-xs text-muted-foreground">
                    {item.createdAt
                      ? formatDistanceToNow(item.createdAt.toDate(), {
                          addSuffix: true,
                        })
                      : "just now"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {item.message}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No messages yet. Start the conversation.
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[200px_1fr]">
            <Input
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={addChatMessage.isPending}
            />
            <Textarea
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={addChatMessage.isPending}
              rows={3}
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            {addChatMessage.error && (
              <p className="text-sm text-destructive">
                {addChatMessage.error.message}
              </p>
            )}
            <Button
              type="submit"
              disabled={addChatMessage.isPending || !message.trim()}
            >
              Send Message
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
