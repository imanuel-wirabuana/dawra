import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addFolder } from "../services/addFolder.service"
import { addActivity } from "@/features/activities/services/add.service"
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

          // Log activity (non-blocking)
          addActivity({
            type: "folder.create",
            entity: "folder",
            entityId: result.id || "",
            message: `Created folder: ${folder.name}`,
            metadata: {
              folderName: folder.name,
              description: folder.description || null,
            },
          }).catch(() => {
            // Ignore errors - activities are non-blocking
          })
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
