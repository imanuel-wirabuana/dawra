"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

const COMMON_EMOJIS = [
  "😀", "😂", "🥰", "😍", "😎", "🤔", "😢", "😡",
  "👍", "👎", "❤️", "🔥", "🎉", "👏", "🤝", "🙏",
  "👀", "🤷", "🤦", "🙌", "💯", "✅", "❌", "❓",
]

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  children: React.ReactNode
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
              onClick={() => onEmojiSelect(emoji)}
              className="flex h-8 w-8 items-center justify-center rounded hover:bg-muted transition-colors text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
