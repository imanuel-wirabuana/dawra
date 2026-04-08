import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Reaction } from "@/types"

const CHATS_COLLECTION = "chats"

export async function addReaction(
  messageId: string,
  reaction: Omit<Reaction, "timestamp">
) {
  const messageRef = doc(db, CHATS_COLLECTION, messageId)
  await updateDoc(messageRef, {
    reactions: arrayUnion(reaction),
  })
}

export async function removeReaction(
  messageId: string,
  reaction: Omit<Reaction, "timestamp">
) {
  const messageRef = doc(db, CHATS_COLLECTION, messageId)
  await updateDoc(messageRef, {
    reactions: arrayRemove(reaction),
  })
}
