import { useMemo } from "react"
import type { ChatMessage } from "@/types"

export function useSearchMessages(
  messages: ChatMessage[],
  searchQuery: string
) {
  return useMemo(() => {
    if (!searchQuery.trim()) return messages

    const query = searchQuery.toLowerCase().trim()
    return messages.filter(
      (msg) =>
        msg.message.toLowerCase().includes(query) ||
        msg.displayName.toLowerCase().includes(query)
    )
  }, [messages, searchQuery])
}
