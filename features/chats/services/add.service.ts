import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { ChatMessage } from "@/types"

export async function addChatMessage(
  message: Omit<ChatMessage, "id" | "createdAt">
) {
  const displayName = message.displayName.trim() || "Guest"
  const text = message.message.trim()

  if (!text) {
    throw new Error("Message cannot be empty")
  }

  if (!message.channelId) {
    throw new Error("Channel ID is required")
  }

  const docRef = await addDoc(collection(db, "chats"), {
    channelId: message.channelId,
    userId: message.userId || "guest",
    displayName,
    message: text,
    createdAt: serverTimestamp(),
    editedAt: null,
    isDeleted: false,
    replyToId: message.replyToId || null,
    reactions: [],
  })

  return {
    id: docRef.id,
    displayName,
    message: text,
    channelId: message.channelId,
    userId: message.userId || "guest",
  }
}
