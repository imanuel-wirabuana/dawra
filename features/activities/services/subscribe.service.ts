import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Activity } from "@/types"

const COLLECTION_NAME = "activities"

/**
 * Subscribe to real-time activities updates
 * @param onUpdate - Callback when activities change
 * @param onError - Callback on error
 * @param maxResults - Maximum number of activities (default: 50)
 * @returns Unsubscribe function
 */
export function subscribeActivities(
  onUpdate: (activities: Activity[]) => void,
  onError?: (error: Error) => void,
  maxResults: number = 50
): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  )

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const activities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Activity[]
      onUpdate(activities)
    },
    (error) => {
      console.error("Activities subscription error:", error)
      onError?.(error)
    }
  )
}
