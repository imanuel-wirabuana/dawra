import { useMutation } from "@tanstack/react-query"
import { addReaction, removeReaction } from "../services/reactions.service"
import type { Reaction } from "@/types"
import { toast } from "sonner"

export function useReactions(messageId: string) {
  const addReactionMutation = useMutation({
    mutationFn: async (reaction: Omit<Reaction, "timestamp">) => {
      try {
        await addReaction(messageId, reaction)
        toast.success("Reaction added")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to add reaction"
        toast.error(message)
        throw error
      }
    },
  })

  const removeReactionMutation = useMutation({
    mutationFn: async (reaction: Omit<Reaction, "timestamp">) => {
      try {
        await removeReaction(messageId, reaction)
        toast.success("Reaction removed")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to remove reaction"
        toast.error(message)
        throw error
      }
    },
  })

  return {
    addReaction: addReactionMutation,
    removeReaction: removeReactionMutation,
  }
}
