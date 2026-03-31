import { onSnapshot, collection } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { BucketList } from "@/types"

export function subscribeToBucketList(
  callback: (data: Partial<BucketList>[]) => void
) {
  onSnapshot(collection(db, "bucket-lists"), (snapshot) => {
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
