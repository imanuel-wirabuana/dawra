import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadPhoto } from "../services/upload.service"

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] })
    },
  })
}
