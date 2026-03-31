"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteFolder } from "../services/deleteFolder.service"

export function useDeleteFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (folderId: string) => {
      const result = await deleteFolder(folderId)
      if (!result.success) {
        throw new Error(result.error || "Failed to delete folder")
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    },
  })
}
