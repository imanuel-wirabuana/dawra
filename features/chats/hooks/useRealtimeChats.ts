import { useEffect, useState } from "react"
import { subscribeToChats } from "../services/subscribe.service"
import type { ChatMessage } from "@/types"

export function useRealtimeChats(channelId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!channelId) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToChats(channelId, (data) => {
      setMessages(data)
      setLoading(false)
    })

    return unsubscribe
  }, [channelId])

  return { messages, loading }
}
