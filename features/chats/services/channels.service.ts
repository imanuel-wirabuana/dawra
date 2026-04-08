import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Channel } from "@/types"

const CHANNELS_COLLECTION = "channels"

export function subscribeToChannels(callback: (data: Channel[]) => void) {
  const channelsRef = collection(db, CHANNELS_COLLECTION)
  const q = query(channelsRef, orderBy("createdAt", "asc"))

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || "",
          description: data.description,
          createdBy: data.createdBy || "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as Channel
      })
    )
  })
}

export async function createChannel(
  channel: Omit<Channel, "id" | "createdAt" | "updatedAt">
) {
  if (!channel.name.trim()) {
    throw new Error("Channel name cannot be empty")
  }

  const docRef = await addDoc(collection(db, CHANNELS_COLLECTION), {
    ...channel,
    name: channel.name.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    ...channel,
  }
}

export async function updateChannel(
  channelId: string,
  updates: Partial<Pick<Channel, "name" | "description">>
) {
  const channelRef = doc(db, CHANNELS_COLLECTION, channelId)
  await updateDoc(channelRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteChannel(channelId: string) {
  const channelRef = doc(db, CHANNELS_COLLECTION, channelId)
  await deleteDoc(channelRef)
}
