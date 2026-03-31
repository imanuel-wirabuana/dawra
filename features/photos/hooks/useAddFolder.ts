import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addFolder } from "../services/addFolder.service"
import type { Folder } from "@/types"

export function useAddFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folder: Omit<Folder, "id">) => addFolder(folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    },
  })
}
