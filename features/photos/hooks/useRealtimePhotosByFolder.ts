"use client"

import { useEffect, useState } from "react"
import { subscribeToPhotosByFolder } from "../services/subscribeByFolder.service"
import type { Photo } from "@/types"

export function useRealtimePhotosByFolder(folderId: string) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!folderId) {
      setPhotos([])
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToPhotosByFolder(folderId, (data) => {
      setPhotos(data)
      setLoading(false)
    })

    return unsubscribe
  }, [folderId])

  return { photos, loading }
}
