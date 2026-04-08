import { useMutation } from "@tanstack/react-query"
import { addChatMessage } from "../services/add.service"
import type { ChatMessage } from "@/types"

export function useAddChatMessage() {
  return useMutation({
    mutationFn: (message: Omit<ChatMessage, "id" | "createdAt">) =>
      addChatMessage(message),
  })
}
