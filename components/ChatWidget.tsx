"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  Loader2,
  Maximize2,
  MessageCircle,
  Minimize2,
  MoreVertical,
  Pencil,
  Reply,
  Send,
  Smile,
  Trash2,
  X,
} from "lucide-react"

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
import ChatsPanelSkeleton from "@/features/chats/components/ChatsPanelSkeleton"
import { useAddChatMessage } from "@/features/chats/hooks/useAddChatMessage"
import { useEditDelete } from "@/features/chats/hooks/useEditDelete"
import { useRealtimeChats } from "@/features/chats/hooks/useRealtimeChats"
import { useReactions } from "@/features/chats/hooks/useReactions"
import { useTyping } from "@/features/chats/hooks/useTyping"
import { editMessage } from "@/features/chats/services/edit-delete.service"

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

function getStoredDisplayName(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("chatDisplayName") ?? ""
}

export default function ChatWidget() {
  const [currentUserId] = useState(generateUserId)
  const [isMinimized, setIsMinimized] = useState(true)
  const [displayName, setDisplayName] = useState(getStoredDisplayName)
  const [message, setMessage] = useState("")
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [editText, setEditText] = useState("")

  const { messages, loading: messagesLoading } = useRealtimeChats()
  const addChatMessage = useAddChatMessage()

  const pathname = usePathname()

  const { typingUsers, updateTyping } = useTyping(
    currentUserId,
    displayName || "Guest"
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, typingUsers, isMinimized])

  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value)
      updateTyping(value.length > 0)
    },
    [updateTyping]
  )

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value)
    if (typeof window !== "undefined") {
      localStorage.setItem("chatDisplayName", value)
    }
  }

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
      className={`fixed right-0 bottom-0 z-50 flex flex-col rounded-lg border border-border bg-card shadow-xl transition-all duration-200 ${
        isMinimized ? "h-10 w-77" : "h-96 w-77"
      } ${pathname === "/" && "hidden"}`}
    >
      {/* Header */}
      <div
        onClick={() => setIsMinimized(!isMinimized)}
        className="flex cursor-pointer items-center justify-between rounded-t-lg border-b border-border bg-primary px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">
            Chat
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
          >
            {isMinimized ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="min-h-0 flex-1">
            <ScrollArea className="h-full p-2">
              <div className="space-y-2">
                {messagesLoading ? (
                  <ChatsPanelSkeleton className="h-full border-0 shadow-none" />
                ) : messages.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No messages yet. Say hello!
                  </p>
                ) : (
                  messages.map((item) => (
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
          </div>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="px-2 py-0.5 text-[10px] text-muted-foreground italic">
              {formatTypingIndicator()}
            </div>
          )}

          {/* Reply Preview */}
          {replyTo && (
            <div className="flex items-center justify-between border-t border-border bg-muted/50 px-2 py-1.5">
              <div className="flex min-w-0 items-center gap-1.5 text-xs">
                <Reply className="h-3 w-3 shrink-0" />
                <span className="shrink-0 text-muted-foreground">Reply to</span>
                <span className="shrink-0 font-medium">
                  {replyTo.displayName}
                </span>
                <span className="truncate text-muted-foreground">
                  {replyTo.message}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0"
                onClick={() => setReplyTo(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border p-2">
            <div className="flex gap-1.5">
              <Input
                placeholder="Name"
                value={displayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
                className="h-8 w-20 shrink-0 text-xs"
                disabled={addChatMessage.isPending}
              />
              <div className="flex flex-1 gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
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
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-lg transition-colors hover:bg-muted"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Textarea
                  ref={inputRef}
                  placeholder="Type..."
                  value={message}
                  onChange={(e) => handleTyping(e.target.value)}
                  disabled={addChatMessage.isPending}
                  rows={1}
                  className="min-h-8 flex-1 resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={addChatMessage.isPending || !message.trim()}
                  size="icon"
                  className="h-8 w-8 shrink-0"
                >
                  {addChatMessage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {addChatMessage.error && (
              <p className="mt-1 text-xs text-destructive">
                {addChatMessage.error.message}
              </p>
            )}
          </form>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMessage}
        onOpenChange={() => setEditingMessage(null)}
      >
        <DialogContent className="sm:max-w-87.5">
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingMessage(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (editingMessage) {
                    await editMessage(editingMessage.id || "", editText)
                    setEditingMessage(null)
                  }
                }}
                disabled={!editText.trim()}
              >
                Save
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
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = []
      }
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
      className={`group flex gap-1.5 ${isOwnMessage ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {message.displayName.charAt(0).toUpperCase()}
      </div>

      <div className={`min-w-0 flex-1 ${isOwnMessage ? "text-right" : ""}`}>
        <div
          className={`inline-block max-w-[90%] rounded-lg px-2 py-1.5 text-left ${
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          } ${message.isDeleted ? "italic opacity-60" : ""}`}
        >
          <div className="mb-0.5 flex items-center gap-1">
            <span className="text-[11px] font-semibold">
              {message.displayName}
            </span>
            <span className="text-[9px] opacity-70">
              {message.createdAt
                ? formatDistanceToNow(message.createdAt.toDate(), {
                    addSuffix: true,
                  })
                : "just now"}
            </span>
            {message.editedAt && (
              <span className="text-[9px] opacity-50">(edited)</span>
            )}
          </div>

          {replyMessage && (
            <div
              className={`mb-1 rounded p-1 text-[9px] ${
                isOwnMessage
                  ? "bg-primary-foreground/20"
                  : "bg-muted-foreground/10"
              }`}
            >
              <p className="font-medium">{replyMessage.displayName}</p>
              <p className="truncate">{replyMessage.message}</p>
            </div>
          )}

          <p className="text-xs whitespace-pre-wrap">{message.message}</p>
        </div>

        {!message.isDeleted && (
          <div className="mt-0.5 flex flex-wrap items-center gap-0.5">
            {Object.entries(groupedReactions).map(([emoji, reactions]) => (
              <Button
                key={emoji}
                variant={
                  reactions?.some((r) => r.userId === currentUserId)
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="h-4 rounded-full px-1 text-[10px]"
                onClick={() => handleReactionClick(emoji)}
                title={reactions?.map((r) => r.displayName).join(", ")}
              >
                <span className="mr-0.5">{emoji}</span>
                <span>{reactions?.length}</span>
              </Button>
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
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
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded transition-colors hover:bg-muted"
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
                  className="h-4 w-4 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onReply} className="text-xs">
                  <Reply className="mr-2 h-3 w-3" />
                  Reply
                </DropdownMenuItem>
                {isOwnMessage && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onStartEdit(message)}
                      className="text-xs"
                    >
                      <Pencil className="mr-2 h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteMessage.mutate()}
                      className="text-xs text-destructive"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
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
