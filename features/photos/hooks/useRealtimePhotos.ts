import { useEffect, useState } from "react"
import { subscribeToPhotos } from "../services/subscribe.service"
import type { Photo } from "@/types"

export function useRealtimePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToPhotos((data) => {
      queueMicrotask(() => {
        setPhotos(data)
        setLoading(false)
      })
    })

    return unsubscribe
  }, [])

  return { photos, loading }
}
