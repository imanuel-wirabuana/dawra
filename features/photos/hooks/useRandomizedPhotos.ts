import { useEffect, useState, useCallback } from "react"
import { getRandomizedPhotos } from "../services/getRandomized.service"
import type { Photo } from "@/types"

export function useRandomizedPhotos(limit: number = 50) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPhotos = useCallback(async () => {
    let cancelled = false

    try {
      setLoading(true)
      const data = await getRandomizedPhotos(limit)
      if (!cancelled) {
        setPhotos(data)
      }
    } catch (error) {
      console.error("Error fetching photos:", error)
    } finally {
      if (!cancelled) {
        setLoading(false)
      }
    }

    return () => {
      cancelled = true
    }
  }, [limit])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  return { photos, loading, refetch: fetchPhotos }
}
