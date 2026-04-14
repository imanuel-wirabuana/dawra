"use client"

import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import {
  format,
  formatDistanceToNow,
  isSameDay,
  isToday,
  isYesterday,
} from "date-fns"
import {
  Loader2,
  MoreVertical,
  Pencil,
  Reply,
  Search,
  Send,
  Smile,
  Trash2,
  X,
  CheckCheck,
  FileText,
  Image as ImageIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
import { GlassCard } from "@/components/ui/glass-card"
import { useReducedMotion } from "@/hooks/useReducedMotion"

import { useAddChatMessage } from "../hooks/useAddChatMessage"
import { useEditDelete } from "../hooks/useEditDelete"
import { useRealtimeChats } from "../hooks/useRealtimeChats"
import { useReactions } from "../hooks/useReactions"
import { useSearchMessages } from "../hooks/useSearchMessages"
import { useTyping } from "../hooks/useTyping"

import ChatsPanelSkeleton from "./ChatsPanelSkeleton"

const COMMON_EMOJIS = [
  "👍",
  "❤️",
  "😂",
  "🎉",
  "🔥",
  "👏",
  "😍",
  "🤔",
  "🤘",
  "👎",
  "😢",
  "😡",
]

function generateUserId(): string {
  if (typeof window === "undefined") return "guest"
  let userId = localStorage.getItem("chatUserId")
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    localStorage.setItem("chatUserId", userId)
  }
  return userId
}

interface ChatsPanelEnhancedProps {
  className?: string
}

// Group messages by date
function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: { date: Date; label: string; messages: ChatMessage[] }[] = []

  messages.forEach((message) => {
    const messageDate = message.createdAt?.toDate() || new Date()
    const lastGroup = groups[groups.length - 1]

    if (!lastGroup || !isSameDay(lastGroup.date, messageDate)) {
      let label: string
      if (isToday(messageDate)) {
        label = "Today"
      } else if (isYesterday(messageDate)) {
        label = "Yesterday"
      } else {
        label = format(messageDate, "MMMM d, yyyy")
      }

      groups.push({
        date: messageDate,
        label,
        messages: [message],
      })
    } else {
      lastGroup.messages.push(message)
    }
  })

  return groups
}

export default function ChatsPanelEnhanced({
  className,
}: ChatsPanelEnhancedProps) {
  const [currentUserId] = useState(generateUserId)
  const [displayName, setDisplayName] = useState("")
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [editText, setEditText] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])

  const { messages, loading: messagesLoading } = useRealtimeChats()
  const addChatMessage = useAddChatMessage()
  const filteredMessages = useSearchMessages(messages, searchQuery)
  const { editMessage } = useEditDelete(editingMessage?.id ?? "")
  const { typingUsers, updateTyping } = useTyping(
    currentUserId,
    displayName || "Guest"
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Group messages by date
  const messageGroups = useMemo(() => {
    return groupMessagesByDate(filteredMessages)
  }, [filteredMessages])

  // Scroll to bottom on new messages
  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      })
    }, 100)
    return () => clearTimeout(timeout)
  }, [filteredMessages, typingUsers, prefersReducedMotion])

  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value)
      updateTyping(value.length > 0)
    },
    [updateTyping]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() && attachments.length === 0) return

    try {
      await addChatMessage.mutateAsync({
        displayName: displayName.trim() || "Guest",
        message: message.trim(),
        userId: currentUserId,
        replyToId: replyTo?.id,
      })

      setMessage("")
      setAttachments([])
      setReplyTo(null)
      updateTyping(false)
    } catch (error) {
      console.error("Failed to send chat message:", error)
    }
  }

  const getReplyMessage = (replyToId: string) => {
    return messages.find((m) => m.id === replyToId)
  }

  return (
    <GlassCard
      blur="md"
      border="subtle"
      hover={false}
      className={cn(
        "flex h-[calc(100vh-12rem)] min-h-80 flex-col overflow-hidden rounded-xl shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <span className="text-sm font-semibold text-primary">C</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Chat</h2>
            <p className="text-xs text-muted-foreground">
              {filteredMessages.length} messages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-36 border-input/60 bg-background/80 pl-8 text-xs transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messagesLoading ? (
              <ChatsPanelSkeleton className="h-full border-0 shadow-none" />
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                  <Send className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {searchQuery ? "No messages found" : "No messages yet"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term"
                    : "Start the conversation!"}
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messageGroups.map((group, groupIndex) => (
                  <motion.div
                    key={group.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
                    className="space-y-3"
                  >
                    {/* Date Separator */}
                    <div className="flex items-center justify-center gap-4 py-2">
                      <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-border" />
                      <span className="rounded-full bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
                        {group.label}
                      </span>
                      <div className="h-px flex-1 bg-linear-to-l from-transparent via-border to-border" />
                    </div>

                    {/* Messages in this group */}
                    <div className="space-y-3">
                      {group.messages.map((item, index) => (
                        <MessageItemEnhanced
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
                          index={index}
                          isLastInGroup={index === group.messages.length - 1}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Typing Indicator */}
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-3 px-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <span className="text-xs font-medium">
                      {typingUsers[0].displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Reply Preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between border-t border-border/50 bg-linear-to-r from-muted/50 to-muted/30 px-4 py-2"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Reply className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="shrink-0 text-xs text-muted-foreground">
                Reply to
              </span>
              <span className="truncate text-xs font-medium">
                {replyTo.displayName}
              </span>
              <span className="max-w-50 truncate text-xs text-muted-foreground">
                {replyTo.message}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => setReplyTo(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border-t border-border/50 bg-linear-to-b from-muted/30 to-muted/5 p-3 sm:flex-row sm:gap-3 sm:p-4"
      >
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-9 w-24 shrink-0 border-input/60 bg-background/80 text-xs transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-32"
            disabled={addChatMessage.isPending}
          />

          <div className="flex flex-1 gap-1.5">
            {/* Emoji Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-md text-muted-foreground transition-all duration-150 hover:bg-primary/10 hover:text-primary"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <div className="grid grid-cols-6 gap-1">
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

            {/* Attachment Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-md text-muted-foreground transition-all duration-150 hover:bg-primary/10 hover:text-primary"
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*,.pdf,.doc,.docx"
                input.multiple = true
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files
                  if (files) {
                    setAttachments(Array.from(files))
                  }
                }
                input.click()
              }}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <Textarea
              ref={inputRef}
              placeholder="Write a message..."
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              disabled={addChatMessage.isPending}
              rows={1}
              className="min-h-9 resize-none border-input/60 bg-background/80 text-xs transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          {attachments.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span>{attachments.length} file(s)</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => setAttachments([])}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {addChatMessage.error && (
            <p className="flex-1 text-[10px] text-destructive sm:flex-none">
              {addChatMessage.error.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={
              addChatMessage.isPending ||
              (!message.trim() && attachments.length === 0)
            }
            className="h-9 gap-1.5 bg-primary px-4 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            {addChatMessage.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </form>

      {/* Edit Dialog */}
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
    </GlassCard>
  )
}

// Animated typing indicator
function TypingIndicator() {
  return (
    <div className="flex h-4 items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

interface MessageItemEnhancedProps {
  message: ChatMessage
  currentUserId: string
  displayName: string
  getReplyMessage: (id: string) => ChatMessage | undefined
  onReply: () => void
  onStartEdit: (msg: ChatMessage) => void
  index?: number
  isLastInGroup?: boolean
}

function MessageItemEnhanced({
  message,
  currentUserId,
  displayName,
  getReplyMessage,
  onReply,
  onStartEdit,
  index = 0,
}: MessageItemEnhancedProps) {
  const isOwnMessage = message.userId === currentUserId
  const replyMessage = message.replyToId
    ? getReplyMessage(message.replyToId)
    : null
  const { addReaction, removeReaction } = useReactions(message.id || "")
  const { deleteMessage } = useEditDelete(message.id || "")
  const prefersReducedMotion = useReducedMotion()

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

  // Message status indicator
  const getMessageStatus = () => {
    if (message.isDeleted) return null
    if (!isOwnMessage) return null
    // Mock status - would come from real-time updates
    return <CheckCheck className="h-3 w-3 text-primary" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.2,
        delay: index * 0.03,
      }}
      className={cn("group flex gap-3", isOwnMessage ? "flex-row-reverse" : "")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
          isOwnMessage
            ? "bg-linear-to-br from-primary to-primary/80 text-primary-foreground"
            : "bg-linear-to-br from-muted to-muted/80"
        )}
      >
        {message.displayName.charAt(0).toUpperCase()}
      </div>

      {/* Message Content */}
      <div
        className={cn("max-w-[80%] flex-1", isOwnMessage ? "text-right" : "")}
      >
        {/* Reply Connector */}
        {replyMessage && (
          <div
            className={cn(
              "mb-1 flex items-center gap-2",
              isOwnMessage ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "h-6 w-0.5 rounded-full",
                isOwnMessage ? "bg-primary/30" : "bg-muted-foreground/30"
              )}
            />
            <div
              className={cn(
                "max-w-50 rounded-lg px-3 py-1.5 text-left text-xs",
                isOwnMessage
                  ? "bg-primary/10 text-primary-foreground/80"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <p className="text-[10px] font-medium opacity-70">
                {replyMessage.displayName}
              </p>
              <p className="truncate">{replyMessage.message}</p>
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "relative inline-block rounded-2xl px-4 py-2.5 text-left transition-all",
            isOwnMessage
              ? "rounded-tr-sm bg-linear-to-br from-primary to-primary/90 text-primary-foreground"
              : "rounded-tl-sm bg-muted",
            message.isDeleted && "bg-muted italic opacity-60"
          )}
        >
          {/* Header */}
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold">{message.displayName}</span>
            <span className="text-[10px] opacity-60">
              {message.createdAt
                ? formatDistanceToNow(message.createdAt.toDate(), {
                    addSuffix: true,
                  })
                : "just now"}
            </span>
            {message.editedAt && (
              <span className="text-[10px] opacity-50">(edited)</span>
            )}
            {getMessageStatus()}
          </div>

          {/* Content */}
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>

        {/* Reactions & Actions */}
        {!message.isDeleted && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {/* Reactions */}
            {Object.entries(groupedReactions).map(([emoji, reactions]) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReactionClick(emoji)}
                className={cn(
                  "flex h-6 items-center gap-1 rounded-full px-2 text-xs transition-all",
                  reactions?.some((r) => r.userId === currentUserId)
                    ? "border border-primary/30 bg-primary/20 text-primary"
                    : "border border-transparent bg-muted/50 hover:bg-muted"
                )}
                title={reactions?.map((r) => r.displayName).join(", ")}
              >
                <span>{emoji}</span>
                <span className="font-medium">{reactions?.length}</span>
              </motion.button>
            ))}

            {/* Action Buttons */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-0 transition-all group-hover:opacity-100 hover:bg-primary/10 hover:text-primary"
                >
                  <Smile className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1.5" align="end">
                <div className="flex gap-0.5">
                  {COMMON_EMOJIS.slice(0, 6).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReactionClick(emoji)}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-base transition-colors hover:bg-muted"
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
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-0 transition-all group-hover:opacity-100"
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
                      className="text-destructive focus:text-destructive"
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
    </motion.div>
  )
}
