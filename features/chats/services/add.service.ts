import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { ChatMessage } from "@/types"

export async function addChatMessage(message: Omit<ChatMessage, "id" | "createdAt">) {
  const displayName = message.displayName.trim() || "Guest"
  const text = message.message.trim()

  if (!text) {
    throw new Error("Message cannot be empty")
  }

  const docRef = await addDoc(collection(db, "chats"), {
    displayName,
    message: text,
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    displayName,
    message: text,
  }
}
