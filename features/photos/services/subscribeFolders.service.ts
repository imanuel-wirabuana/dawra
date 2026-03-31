import { onSnapshot, collection, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Folder } from "@/types"

export function subscribeToFolders(callback: (data: Folder[]) => void) {
  const foldersRef = collection(db, "folders")
  const q = query(foldersRef, orderBy("createdAt", "desc"))

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          createdAt: data.createdAt,
        } as Folder
      })
    )
  })
}
