import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addFolder } from "../services/addFolder.service"
import type { Folder } from "@/types"
import { toast } from "sonner"

export function useAddFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (folder: Omit<Folder, "id">) => {
      const toastId = toast.loading("Creating folder...")
      try {
        const result = await addFolder(folder)
        if (result.success) {
          toast.success("Folder created", { id: toastId })
        } else {
          toast.error(result.error || "Failed to create folder", {
            id: toastId,
          })
        }
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create folder"
        toast.error(message, { id: toastId })
        throw error
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["folders"] })
      }
    },
  })
}
