import { useMutation } from "@tanstack/react-query"
import { deleteMessage, editMessage } from "../services/edit-delete.service"
import { toast } from "sonner"

export function useEditDelete(messageId: string) {
  const editMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const toastId = toast.loading("Updating message...")
      try {
        await editMessage(messageId, newMessage)
        toast.success("Message updated", { id: toastId })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update message"
        toast.error(message, { id: toastId })
        throw error
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const toastId = toast.loading("Deleting message...")
      try {
        await deleteMessage(messageId)
        toast.success("Message deleted", { id: toastId })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete message"
        toast.error(message, { id: toastId })
        throw error
      }
    },
  })

  return {
    editMessage: editMutation,
    deleteMessage: deleteMutation,
  }
}
