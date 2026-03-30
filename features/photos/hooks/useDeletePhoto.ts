import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePhoto } from "../services/delete.service"

export function useDeletePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] })
    },
    onError: (error) => {
      console.error("Delete photo error:", error)
    },
  })
}
