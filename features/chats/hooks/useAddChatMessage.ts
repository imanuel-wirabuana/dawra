import { useMutation } from "@tanstack/react-query"
import { addChatMessage } from "../services/add.service"
import type { ChatMessage } from "@/types"
import { toast } from "sonner"

export function useAddChatMessage() {
  return useMutation({
    mutationFn: async (message: Omit<ChatMessage, "id" | "createdAt">) => {
      const toastId = toast.loading("Sending message...")
      try {
        const result = await addChatMessage(message)
        toast.success("Message sent", { id: toastId })
        return result
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send message"
        toast.error(message, { id: toastId })
        throw error
      }
    },
  })
}
