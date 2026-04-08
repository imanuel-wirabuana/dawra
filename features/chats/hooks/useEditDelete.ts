import { useMutation } from "@tanstack/react-query"
import { deleteMessage, editMessage } from "../services/edit-delete.service"

export function useEditDelete(messageId: string, userId: string) {
  const editMutation = useMutation({
    mutationFn: (newMessage: string) => editMessage(messageId, newMessage, userId),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteMessage(messageId, userId),
  })

  return {
    editMessage: editMutation,
    deleteMessage: deleteMutation,
  }
}
