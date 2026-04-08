import { useMutation } from "@tanstack/react-query"
import { addReaction, removeReaction } from "../services/reactions.service"
import type { Reaction } from "@/types"

export function useReactions(messageId: string) {
  const addReactionMutation = useMutation({
    mutationFn: (reaction: Omit<Reaction, "timestamp">) =>
      addReaction(messageId, reaction),
  })

  const removeReactionMutation = useMutation({
    mutationFn: (reaction: Omit<Reaction, "timestamp">) =>
      removeReaction(messageId, reaction),
  })

  return {
    addReaction: addReactionMutation,
    removeReaction: removeReactionMutation,
  }
}
