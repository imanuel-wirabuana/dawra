import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { ChatMessage } from "@/types"

export function subscribeToChats(
  channelId: string,
  callback: (data: ChatMessage[]) => void
) {
  const chatsRef = collection(db, "chats")
  const q = query(
    chatsRef,
    where("channelId", "==", channelId),
    orderBy("createdAt", "asc")
  )

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          channelId: data.channelId || "",
          userId: data.userId || "",
          displayName: data.displayName || "Guest",
          message: data.message || "",
          createdAt: data.createdAt,
          editedAt: data.editedAt,
          isDeleted: data.isDeleted || false,
          replyToId: data.replyToId,
          reactions: data.reactions || [],
        } as ChatMessage
      })
    )
  })
}
