"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  ChevronDown,
  Loader2,
  MoreVertical,
  Pencil,
  Reply,
  Search,
  Send,
  Smile,
  Trash2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

import { useAddChatMessage } from "../hooks/useAddChatMessage"
import { useEditDelete } from "../hooks/useEditDelete"
import { useRealtimeChats } from "../hooks/useRealtimeChats"
import { useReactions } from "../hooks/useReactions"
import { useSearchMessages } from "../hooks/useSearchMessages"
import { useTyping } from "../hooks/useTyping"
import ChatsPanelSkeleton from "./ChatsPanelSkeleton"

const COMMON_EMOJIS = ["👍", "❤️", "😂", "🎉", "🔥", "👏", "😍", "🤔", "🤘"]

function generateUserId(): string {
  if (typeof window === "undefined") return "guest"

  let userId = localStorage.getItem("chatUserId")
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    localStorage.setItem("chatUserId", userId)
  }
  return userId
}

interface ChatsPanelProps {
  className?: string
}

export default function ChatsPanel({ className }: ChatsPanelProps) {
  const [currentUserId] = useState(generateUserId)
  const [displayName, setDisplayName] = useState("")
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [editText, setEditText] = useState("")

  const { messages, loading: messagesLoading } = useRealtimeChats()
  const addChatMessage = useAddChatMessage()
  const filteredMessages = useSearchMessages(messages, searchQuery)
  const { editMessage } = useEditDelete(editingMessage?.id ?? "")

  const { typingUsers, updateTyping } = useTyping(
    currentUserId,
    displayName || "Guest"
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollToBottom = useCallback(() => {
    const scrollArea = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null
    if (scrollArea) {
      scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    )
    if (!scrollArea) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollArea as HTMLElement
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    scrollArea.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => scrollArea.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value)
      updateTyping(value.length > 0)
    },
    [updateTyping]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    try {
      await addChatMessage.mutateAsync({
        displayName: displayName.trim() || "Guest",
        message: message.trim(),
        userId: currentUserId,
        replyToId: replyTo?.id,
      })
      setMessage("")
      setReplyTo(null)
      updateTyping(false)
    } catch (error) {
      console.error("Failed to send chat message:", error)
    }
  }

  const getReplyMessage = (replyToId: string) => {
    return messages.find((m) => m.id === replyToId)
  }

  const formatTypingIndicator = () => {
    if (typingUsers.length === 0) return null
    if (typingUsers.length === 1)
      return `${typingUsers[0].displayName} is typing...`
    if (typingUsers.length === 2)
      return `${typingUsers[0].displayName} and ${typingUsers[1].displayName} are typing...`
    return `${typingUsers[0].displayName} and ${typingUsers.length - 1} others are typing...`
  }

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-12rem)] min-h-80 flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm sm:h-[calc(100vh-14rem)] sm:min-h-96",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-2 py-2 sm:px-3">
        <h2 className="text-xs font-semibold text-foreground">Chat</h2>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 w-36 border-input/60 bg-background pl-8 text-xs transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-48"
          />
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <ScrollArea ref={scrollAreaRef} className="h-full flex-1 p-3">
          <div className="space-y-2">
            {messagesLoading ? (
              <ChatsPanelSkeleton className="h-full border-0 shadow-none" />
            ) : filteredMessages.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                {searchQuery
                  ? "No messages found"
                  : "No messages yet. Start chatting!"}
              </p>
            ) : (
              filteredMessages.map((item) => (
                <MessageItem
                  key={item.id}
                  message={item}
                  currentUserId={currentUserId}
                  displayName={displayName}
                  getReplyMessage={getReplyMessage}
                  onReply={() => setReplyTo(item)}
                  onStartEdit={(msg) => {
                    setEditingMessage(msg)
                    setEditText(msg.message)
                  }}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        {showScrollButton && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 bottom-4 h-8 w-8 rounded-full shadow-md"
            onClick={scrollToBottom}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      {typingUsers.length > 0 && (
        <div className="px-3 py-1 text-[10px] text-muted-foreground italic">
          {formatTypingIndicator()}
        </div>
      )}

      {replyTo && (
        <div className="flex items-center justify-between border-t border-border/50 bg-linear-to-r from-muted/50 to-muted/30 px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <Reply className="h-3 w-3" />
            <span className="text-muted-foreground">Reply to</span>
            <span className="font-medium">{replyTo.displayName}</span>
            <span className="max-w-32 truncate text-muted-foreground">
              {replyTo.message}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => setReplyTo(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border-t border-border/50 bg-linear-to-b from-muted/30 to-muted/5 p-2 sm:flex-row sm:gap-3 sm:p-3"
      >
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-8 w-20 shrink-0 border-input/60 bg-background text-xs transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-28"
            disabled={addChatMessage.isPending}
          />
          <div className="flex flex-1 gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-md text-muted-foreground transition-all duration-150 hover:bg-primary/10 hover:text-primary"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <div className="grid grid-cols-8 gap-1">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setMessage((prev) => prev + emoji)}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-base transition-colors hover:bg-muted"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Textarea
              ref={inputRef}
              placeholder="Write a message..."
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              disabled={addChatMessage.isPending}
              rows={1}
              className="min-h-8 resize-none border-input/60 bg-background text-xs transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          {addChatMessage.error && (
            <p className="flex-1 text-[10px] text-destructive sm:flex-none">
              {addChatMessage.error.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={addChatMessage.isPending || !message.trim()}
            className="h-8 gap-1 bg-primary px-3 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 sm:h-full"
          >
            {addChatMessage.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </form>

      <Dialog
        open={!!editingMessage}
        onOpenChange={() => setEditingMessage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingMessage(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (editingMessage) {
                    await editMessage.mutateAsync(editText)
                    setEditingMessage(null)
                  }
                }}
                disabled={!editText.trim() || editMessage.isPending}
              >
                {editMessage.isPending ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MessageItemProps {
  message: ChatMessage
  currentUserId: string
  displayName: string
  getReplyMessage: (id: string) => ChatMessage | undefined
  onReply: () => void
  onStartEdit: (msg: ChatMessage) => void
}

function MessageItem({
  message,
  currentUserId,
  displayName,
  getReplyMessage,
  onReply,
  onStartEdit,
}: MessageItemProps) {
  const isOwnMessage = message.userId === currentUserId
  const replyMessage = message.replyToId
    ? getReplyMessage(message.replyToId)
    : null
  const { addReaction, removeReaction } = useReactions(message.id || "")
  const { deleteMessage } = useEditDelete(message.id || "")

  const groupedReactions = (message.reactions || []).reduce(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) acc[reaction.emoji] = []
      acc[reaction.emoji]!.push(reaction)
      return acc
    },
    {} as Record<string, typeof message.reactions>
  )

  const handleReactionClick = (emoji: string) => {
    const hasReacted = groupedReactions[emoji]?.some(
      (r) => r.userId === currentUserId
    )
    const reaction = { emoji, userId: currentUserId, displayName }

    if (hasReacted) {
      removeReaction.mutate(reaction)
    } else {
      addReaction.mutate(reaction)
    }
  }

  return (
    <div
      className={`group flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {message.displayName.charAt(0).toUpperCase()}
      </div>

      <div className={`max-w-[80%] flex-1 ${isOwnMessage ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-left ${
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          } ${message.isDeleted ? "italic opacity-60" : ""}`}
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold">{message.displayName}</span>
            <span className="text-xs opacity-70">
              {message.createdAt
                ? formatDistanceToNow(message.createdAt.toDate(), {
                    addSuffix: true,
                  })
                : "just now"}
            </span>
            {message.editedAt && (
              <span className="text-xs opacity-50">(edited)</span>
            )}
          </div>

          {replyMessage && (
            <div
              className={`mb-2 rounded p-2 text-xs ${
                isOwnMessage
                  ? "bg-primary-foreground/20"
                  : "bg-muted-foreground/10"
              }`}
            >
              <p className="font-medium">{replyMessage.displayName}</p>
              <p className="truncate">{replyMessage.message}</p>
            </div>
          )}

          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>

        {!message.isDeleted && (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {Object.entries(groupedReactions).map(([emoji, reactions]) => (
              <Button
                key={emoji}
                variant={
                  reactions?.some((r) => r.userId === currentUserId)
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="h-6 rounded-full px-2 text-xs"
                onClick={() => handleReactionClick(emoji)}
                title={reactions?.map((r) => r.displayName).join(", ")}
              >
                <span className="mr-1">{emoji}</span>
                <span>{reactions?.length}</span>
              </Button>
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Smile className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <div className="grid grid-cols-8 gap-1">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReactionClick(emoji)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-lg transition-colors hover:bg-muted"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onReply}>
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </DropdownMenuItem>
                {isOwnMessage && (
                  <>
                    <DropdownMenuItem onClick={() => onStartEdit(message)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteMessage.mutate()}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
}
