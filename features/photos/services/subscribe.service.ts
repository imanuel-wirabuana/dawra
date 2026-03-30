import { onSnapshot, collection, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Photo } from "@/types"

export function subscribeToPhotos(
  callback: (data: Photo[]) => void
) {
  const photosRef = collection(db, "photos")
  const q = query(photosRef, orderBy("createdAt", "desc"))
  
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: data.id,
          url: data.url,
          name: data.name,
          realFileName: data.realFileName,
          extension: data.extension || '',
          size: data.size || 0,
        } as Photo
      })
    )
  })
}
