import { useMutation } from "@tanstack/react-query"
import { addChatMessage } from "../services/add.service"
import { addActivity } from "@/features/activities/services/add.service"
import type { ChatMessage } from "@/types"
import { toast } from "sonner"

export function useAddChatMessage() {
  return useMutation({
    mutationFn: async (message: Omit<ChatMessage, "id" | "createdAt">) => {
      const toastId = toast.loading("Sending message...")
      try {
        const result = await addChatMessage(message)
        toast.success("Message sent", { id: toastId })

        // Log activity (non-blocking)
        addActivity({
          type: "chat.create",
          entity: "chat",
          entityId: result.id || "",
          message: "Sent a chat message",
          metadata: {
            messageLength: message.message?.length || 0,
            isReply: !!message.replyToId,
          },
        }).catch(() => {
          // Ignore errors - activities are non-blocking
        })

        return result
      } catch (error) {
        const messageStr =
          error instanceof Error ? error.message : "Failed to send message"
        toast.error(messageStr, { id: toastId })
        throw error
      }
    },
  })
}
