import { useEffect, useState } from "react"
import { setTypingStatus, subscribeToTyping } from "../services/typing.service"
import type { TypingStatus } from "@/types"

export function useTyping(userId: string, displayName: string) {
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToTyping(userId, setTypingUsers)

    return unsubscribe
  }, [userId])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isTyping) {
        setTypingStatus(userId, displayName, false)
        setIsTyping(false)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [userId, displayName, isTyping])

  const updateTyping = (typing: boolean) => {
    if (typing === isTyping) return

    setIsTyping(typing)
    setTypingStatus(userId, displayName, typing)
  }

  return { typingUsers, isTyping, updateTyping }
}
