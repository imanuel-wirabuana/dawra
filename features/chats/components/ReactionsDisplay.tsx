"use client"

import { Button } from "@/components/ui/button"
import { EmojiPicker } from "./EmojiPicker"
import { Plus } from "lucide-react"
import type { Reaction } from "@/types"
import { useReactions } from "../hooks/useReactions"

interface ReactionsDisplayProps {
  messageId: string
  reactions: Reaction[]
  currentUserId: string
}

export function ReactionsDisplay({
  messageId,
  reactions,
  currentUserId,
}: ReactionsDisplayProps) {
  const { addReaction, removeReaction } = useReactions(messageId)

  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = []
    }
    acc[reaction.emoji].push(reaction)
    return acc
  }, {} as Record<string, Reaction[]>)

  const handleReactionClick = (emoji: string) => {
    const hasReacted = groupedReactions[emoji]?.some(
      (r) => r.userId === currentUserId
    )

    if (hasReacted) {
      removeReaction.mutate({ emoji, userId: currentUserId, displayName: "" })
    } else {
      addReaction.mutate({ emoji, userId: currentUserId, displayName: "" })
    }
  }

  const handleAddNewReaction = (emoji: string) => {
    addReaction.mutate({ emoji, userId: currentUserId, displayName: "" })
  }

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {Object.entries(groupedReactions).map(([emoji, emojiReactions]) => {
        const hasUserReacted = emojiReactions.some(
          (r) => r.userId === currentUserId
        )
        return (
          <Button
            key={emoji}
            variant={hasUserReacted ? "secondary" : "ghost"}
            size="sm"
            className="h-6 px-2 text-xs rounded-full"
            onClick={() => handleReactionClick(emoji)}
            title={emojiReactions.map((r) => r.displayName).join(", ")}
          >
            <span className="mr-1">{emoji}</span>
            <span>{emojiReactions.length}</span>
          </Button>
        )
      })}
      <EmojiPicker onEmojiSelect={handleAddNewReaction}>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </EmojiPicker>
    </div>
  )
}
