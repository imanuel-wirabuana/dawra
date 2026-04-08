import { useEffect, useState } from "react"
import { setTypingStatus, subscribeToTyping } from "../services/typing.service"
import type { TypingStatus } from "@/types"

export function useTyping(
  channelId: string,
  userId: string,
  displayName: string
) {
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!channelId) return

    const unsubscribe = subscribeToTyping(
      channelId,
      userId,
      setTypingUsers
    )

    return unsubscribe
  }, [channelId, userId])

  useEffect(() => {
    if (!channelId) return

    const timeout = setTimeout(() => {
      if (isTyping) {
        setTypingStatus(channelId, userId, displayName, false)
        setIsTyping(false)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [channelId, userId, displayName, isTyping])

  const updateTyping = (typing: boolean) => {
    if (typing === isTyping) return

    setIsTyping(typing)
    setTypingStatus(channelId, userId, displayName, typing)
  }

  return { typingUsers, isTyping, updateTyping }
}
