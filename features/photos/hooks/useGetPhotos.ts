import { useQuery } from "@tanstack/react-query"
import { getPhotos } from "../services/get.service"
import type { Photo } from "@/types"

export function useGetPhotos() {
  return useQuery<Photo[]>({
    queryKey: ["photos"],
    queryFn: getPhotos,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
