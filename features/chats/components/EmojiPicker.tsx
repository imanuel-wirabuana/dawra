"use client"

import type { ReactNode } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const COMMON_EMOJIS = [
  "😀",
  "😂",
  "🥰",
  "😍",
  "😎",
  "🤔",
  "😢",
  "😡",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "🎉",
  "👏",
  "🤝",
  "🙏",
  "👀",
  "🤷",
  "🤦",
  "🙌",
  "💯",
  "✅",
  "❌",
  "❓",
]

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  children: ReactNode
}

export function EmojiPicker({ onEmojiSelect, children }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="grid grid-cols-8 gap-1">
          {COMMON_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onEmojiSelect(emoji)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-lg transition-colors hover:bg-muted"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
