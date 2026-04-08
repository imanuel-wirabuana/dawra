import { useEffect, useState } from "react"
import { subscribeToChannels } from "../services/channels.service"
import type { Channel } from "@/types"

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToChannels((data) => {
      setChannels(data)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { channels, loading }
}
