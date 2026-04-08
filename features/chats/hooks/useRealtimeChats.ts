import { useEffect, useState } from "react"
import { subscribeToChats } from "../services/subscribe.service"
import type { ChatMessage } from "@/types"

export function useRealtimeChats() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToChats((data) => {
      setMessages(data)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { messages, loading }
}
