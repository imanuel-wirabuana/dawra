import { onSnapshot, collection } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { ItineraryItem } from "@/types"

export function subscribeToItineraryItems(
  callback: (data: Partial<ItineraryItem>[]) => void
) {
  return onSnapshot(collection(db, "itineraries"), (snapshot) => {
    callback(
      snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        }
      })
    )
  })
}
