import { useEffect, useState } from "react"
import { subscribeToBucketList } from "../../bucket-lists/services/subscribe.service"
import type { BucketList } from "@/types"

export function useGetBucketListItems() {
  const [bucketList, setBucketList] = useState<BucketList[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToBucketList((data) => {
      setBucketList(data as BucketList[])
    })

    return unsubscribe
  }, [])

  return bucketList
}
