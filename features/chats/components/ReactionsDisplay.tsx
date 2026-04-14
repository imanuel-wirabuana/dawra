"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Reaction } from "@/types"

import { useReactions } from "../hooks/useReactions"
import { EmojiPicker } from "./EmojiPicker"

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

  const groupedReactions = reactions.reduce<Record<string, Reaction[]>>(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = []
      }
      acc[reaction.emoji].push(reaction)
      return acc
    },
    {}
  )

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
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {Object.entries(groupedReactions).map(([emoji, emojiReactions]) => {
        const hasUserReacted = emojiReactions.some(
          (r) => r.userId === currentUserId
        )
        return (
          <Button
            key={emoji}
            variant={hasUserReacted ? "secondary" : "ghost"}
            size="sm"
            className="h-6 rounded-full px-2 text-xs"
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
          className="h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </EmojiPicker>
    </div>
  )
}
