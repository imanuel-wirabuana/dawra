import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadPhoto } from "../services/upload.service"
import { toast } from "sonner"

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      folderId,
    }: {
      file: File
      folderId?: string
    }) => {
      const toastId = toast.loading(`Uploading ${file.name}...`)
      try {
        const result = await uploadPhoto(file, folderId)
        toast.success(`${file.name} uploaded`, { id: toastId })
        return result
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : `Failed to upload ${file.name}`
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] })
    },
  })
}
