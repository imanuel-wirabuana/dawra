import { useQuery } from "@tanstack/react-query"
import { getBucketLists } from "../services/get.service"
import type { BucketList } from "@/types"

export function useGetBucketListItems() {
  return useQuery<BucketList[]>({
    queryKey: ["bucket-lists"],
    queryFn: getBucketLists,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
