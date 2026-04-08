import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { TypingStatus } from "@/types"

const TYPING_COLLECTION = "typing"

export function subscribeToTyping(
  channelId: string,
  currentUserId: string,
  callback: (typingUsers: TypingStatus[]) => void
) {
  const typingRef = collection(db, TYPING_COLLECTION)
  const q = query(typingRef, where("channelId", "==", channelId))

  return onSnapshot(q, (snapshot) => {
    const typingUsers = snapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          userId: data.userId,
          displayName: data.displayName,
          channelId: data.channelId,
          isTyping: data.isTyping,
          timestamp: data.timestamp,
        } as TypingStatus
      })
      .filter(
        (status) =>
          status.isTyping &&
          status.userId !== currentUserId &&
          status.timestamp &&
          new Date().getTime() - status.timestamp.toDate().getTime() < 10000
      )

    callback(typingUsers)
  })
}

export async function setTypingStatus(
  channelId: string,
  userId: string,
  displayName: string,
  isTyping: boolean
) {
  const typingDocId = `${channelId}_${userId}`
  const typingRef = doc(db, TYPING_COLLECTION, typingDocId)

  if (isTyping) {
    await setDoc(typingRef, {
      userId,
      displayName,
      channelId,
      isTyping,
      timestamp: serverTimestamp(),
    })
  } else {
    await deleteDoc(typingRef)
  }
}
