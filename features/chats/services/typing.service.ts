import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { TypingStatus } from "@/types"

const TYPING_COLLECTION = "typing"

export function subscribeToTyping(
  currentUserId: string,
  callback: (typingUsers: TypingStatus[]) => void
) {
  const typingRef = collection(db, TYPING_COLLECTION)

  return onSnapshot(query(typingRef), (snapshot) => {
    const typingUsers = snapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          userId: data.userId,
          displayName: data.displayName,
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
  userId: string,
  displayName: string,
  isTyping: boolean
) {
  const typingRef = doc(db, TYPING_COLLECTION, userId)

  if (isTyping) {
    await setDoc(typingRef, {
      userId,
      displayName,
      isTyping,
      timestamp: serverTimestamp(),
    })
  } else {
    await deleteDoc(typingRef)
  }
}
