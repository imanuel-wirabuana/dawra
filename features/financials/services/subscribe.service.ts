import { onSnapshot, collection } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Transaction } from "@/types"

export function subscribeToTransactions(
  callback: (data: Transaction[]) => void
) {
  return onSnapshot(collection(db, "transactions"), (snapshot) => {
    callback(
      snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as Transaction
      })
    )
  })
}
