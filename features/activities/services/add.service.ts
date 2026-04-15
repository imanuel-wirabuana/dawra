import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Activity } from "@/types"

/**
 * Add a new activity log entry
 * Non-blocking - failures are silently caught
 */
export async function addActivity(
  data: Omit<Activity, "id" | "createdAt">
): Promise<void> {
  try {
    await addDoc(collection(db, "activities"), {
      ...data,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    // Silently catch - activities are non-blocking
    console.error("Failed to log activity:", error)
  }
}
