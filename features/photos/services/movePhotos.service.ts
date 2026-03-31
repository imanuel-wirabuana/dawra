import { db } from "@/lib/firebase/client"
import { collection, query, where, getDocs, updateDoc, writeBatch, doc } from "firebase/firestore"

export async function movePhotosToFolder(
  photoIds: string[],
  folderId: string | null
): Promise<void> {
  if (photoIds.length === 0) return

  try {
    const photosRef = collection(db, "photos")
    const batch = writeBatch(db)

    // Query for photos by their id field (not doc id)
    const q = query(photosRef, where("id", "in", photoIds))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn("No photos found to move")
      return
    }

    snapshot.docs.forEach((docSnapshot) => {
      const photoRef = doc(db, "photos", docSnapshot.id)
      batch.update(photoRef, {
        folderId: folderId,
      })
    })

    await batch.commit()
  } catch (error) {
    console.error("Error moving photos to folder:", error)
    throw error
  }
}
