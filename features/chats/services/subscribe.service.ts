import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { ChatMessage } from "@/types"

export function subscribeToChats(callback: (data: ChatMessage[]) => void) {
  const chatsRef = collection(db, "chats")
  const q = query(chatsRef, orderBy("createdAt", "asc"))

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => {
        const data = doc.data() as ChatMessage
        return {
          id: doc.id,
          displayName: data.displayName || "Guest",
          message: data.message || "",
          createdAt: data.createdAt,
        }
      })
    )
  })
}
