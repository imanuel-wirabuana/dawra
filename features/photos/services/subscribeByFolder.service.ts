import { onSnapshot, collection, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Photo } from "@/types"

export function subscribeToPhotosByFolder(
  folderId: string,
  callback: (data: Photo[]) => void
) {
  const photosRef = collection(db, "photos")
  const q = query(
    photosRef,
    where("folderId", "==", folderId),
    orderBy("createdAt", "desc")
  )

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: data.id,
          url: data.url,
          name: data.name,
          realFileName: data.realFileName,
          extension: data.extension || "",
          size: data.size || 0,
          folderId: data.folderId,
        } as Photo
      })
    )
  })
}
