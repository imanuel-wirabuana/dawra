"use client"

import { useEffect, useState } from "react"
import { subscribeToFolders } from "../services/subscribeFolders.service"
import type { Folder } from "@/types"

export function useRealtimeFolders() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToFolders((data) => {
      setFolders(data)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { folders, loading }
}
