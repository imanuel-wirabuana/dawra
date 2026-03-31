import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadPhoto } from "../services/upload.service"

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId?: string }) =>
      uploadPhoto(file, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] })
    },
  })
}
