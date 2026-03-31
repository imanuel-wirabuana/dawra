import { doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"

export async function deleteFolder(folderId: string): Promise<void> {
  try {
    const folderRef = doc(db, "folders", folderId)
    await deleteDoc(folderRef)
  } catch (error) {
    console.error("Error deleting folder:", error)
    throw error
  }
}
