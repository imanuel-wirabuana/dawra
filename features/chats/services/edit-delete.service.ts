import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"

const CHATS_COLLECTION = "chats"

export async function editMessage(messageId: string, newMessage: string) {
  if (!newMessage.trim()) {
    throw new Error("Message cannot be empty")
  }

  const messageRef = doc(db, CHATS_COLLECTION, messageId)
  await updateDoc(messageRef, {
    message: newMessage.trim(),
    editedAt: serverTimestamp(),
  })
}

export async function deleteMessage(messageId: string) {
  const messageRef = doc(db, CHATS_COLLECTION, messageId)
  await updateDoc(messageRef, {
    isDeleted: true,
    message: "This message was deleted",
  })
}

export async function permanentlyDeleteMessage(messageId: string) {
  const messageRef = doc(db, CHATS_COLLECTION, messageId)
  await deleteDoc(messageRef)
}
