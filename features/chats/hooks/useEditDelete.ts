import { useMutation } from "@tanstack/react-query"
import { deleteMessage, editMessage } from "../services/edit-delete.service"
import { addActivity } from "@/features/activities/services/add.service"
import { toast } from "sonner"

export function useEditDelete(messageId: string) {
  const editMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const toastId = toast.loading("Updating message...")
      try {
        await editMessage(messageId, newMessage)
        toast.success("Message updated", { id: toastId })

        // Log activity (non-blocking)
        addActivity({
          type: "chat.update",
          entity: "chat",
          entityId: messageId,
          message: "Edited a chat message",
          metadata: {
            newLength: newMessage.length,
          },
        }).catch(() => {
          // Ignore errors - activities are non-blocking
        })
      } catch (error) {
        const messageStr =
          error instanceof Error ? error.message : "Failed to update message"
        toast.error(messageStr, { id: toastId })
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

        // Log activity (non-blocking)
        addActivity({
          type: "chat.delete",
          entity: "chat",
          entityId: messageId,
          message: "Deleted a chat message",
          metadata: {},
        }).catch(() => {
          // Ignore errors - activities are non-blocking
        })
      } catch (error) {
        const messageStr =
          error instanceof Error ? error.message : "Failed to delete message"
        toast.error(messageStr, { id: toastId })
        throw error
      }
    },
  })

  return {
    editMessage: editMutation,
    deleteMessage: deleteMutation,
  }
}
