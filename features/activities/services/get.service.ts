import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Activity } from "@/types"

const COLLECTION_NAME = "activities"

/**
 * Get latest activities ordered by creation time (newest first)
 * @param maxResults - Maximum number of activities to fetch (default: 50)
 */
export async function getActivities(
  maxResults: number = 50
): Promise<Activity[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Activity[]
}
