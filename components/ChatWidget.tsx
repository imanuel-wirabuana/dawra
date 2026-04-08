"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Smile,
  Send,
  Loader2,
  MoreVertical,
  Reply,
  Trash2,
  Pencil,
  Hash,
  ChevronDown,
} from "lucide-react"
import { useAddChatMessage } from "@/features/chats/hooks/useAddChatMessage"
import { useRealtimeChats } from "@/features/chats/hooks/useRealtimeChats"
import { useChannels } from "@/features/chats/hooks/useChannels"
import { useTyping } from "@/features/chats/hooks/useTyping"
import { useReactions } from "@/features/chats/hooks/useReactions"
import { useEditDelete } from "@/features/chats/hooks/useEditDelete"
import { editMessage } from "@/features/chats/services/edit-delete.service"
import type { Channel, ChatMessage } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const COMMON_EMOJIS = ["👍", "❤️", "😂", "🎉", "🔥", "👏", "😍", "🤔", "🤘"]

const generateUserId = () => {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("chatUserId")
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("chatUserId", userId)
    }
    return userId
  }
  return "guest"
}

const getStoredDisplayName = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("chatDisplayName") || ""
  }
  return ""
}

export default function ChatWidget() {
  const [currentUserId] = useState(generateUserId)
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [displayName, setDisplayName] = useState(getStoredDisplayName)
  const [message, setMessage] = useState("")
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [editText, setEditText] = useState("")
  const [showChannels, setShowChannels] = useState(false)

  const { channels, loading: channelsLoading } = useChannels()
  const { messages, loading: messagesLoading } = useRealtimeChats(
    selectedChannel?.id || ""
  )
  const addChatMessage = useAddChatMessage(selectedChannel?.id || "")

  const { typingUsers, updateTyping } = useTyping(
    selectedChannel?.id || "",
    currentUserId,
    displayName || "Guest"
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0])
    }
  }, [channels, selectedChannel])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, typingUsers, isOpen, isMinimized])

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
    if (!selectedChannel || !message.trim()) return

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

  const unreadCount = messages.length

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-4 z-50 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="text-destructive-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`fixed right-4 bottom-4 z-50 flex flex-col rounded-xl border border-border bg-card shadow-2xl transition-all duration-200 ${
            isMinimized ? "h-14 w-80" : "h-[500px] w-96 sm:w-[450px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-xl border-b border-border bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
              {selectedChannel ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChannels(true)}
                    className="flex items-center gap-1 text-primary-foreground transition-opacity hover:opacity-80"
                  >
                    <Hash className="h-4 w-4" />
                    <span className="font-semibold">
                      {selectedChannel.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="font-semibold text-primary-foreground">
                  Chat
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="min-h-0 flex-1">
                <ScrollArea className="h-full p-3">
                  <div className="space-y-3">
                    {messagesLoading ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        Loading...
                      </p>
                    ) : messages.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
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
                <div className="px-3 py-1 text-xs text-muted-foreground italic">
                  {formatTypingIndicator()}
                </div>
              )}

              {/* Reply Preview */}
              {replyTo && (
                <div className="flex items-center justify-between border-t border-border bg-muted/50 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2 text-sm">
                    <Reply className="h-3 w-3 shrink-0" />
                    <span className="shrink-0 text-muted-foreground">
                      Reply to
                    </span>
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
                    className="h-6 w-6 shrink-0"
                    onClick={() => setReplyTo(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-border p-3"
              >
                <div className="flex gap-2">
                  <Input
                    placeholder="Name"
                    value={displayName}
                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                    className="h-9 w-24 shrink-0"
                    disabled={addChatMessage.isPending}
                  />
                  <div className="flex flex-1 gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0"
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
                              className="flex h-8 w-8 items-center justify-center rounded text-lg transition-colors hover:bg-muted"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Textarea
                      ref={inputRef}
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => handleTyping(e.target.value)}
                      disabled={addChatMessage.isPending}
                      rows={1}
                      className="min-h-9 flex-1 resize-none"
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
                      className="h-9 w-9 shrink-0"
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
        </div>
      )}

      {/* Channel Selector Dialog */}
      <Dialog open={showChannels} onOpenChange={setShowChannels}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Select Channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 py-2">
            {channelsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : channels.length === 0 ? (
              <p className="text-sm text-muted-foreground">No channels yet</p>
            ) : (
              channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    setSelectedChannel(channel)
                    setShowChannels(false)
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedChannel?.id === channel.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Hash className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{channel.name}</p>
                    {channel.description && (
                      <p className="truncate text-xs opacity-80">
                        {channel.description}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMessage}
        onOpenChange={() => setEditingMessage(null)}
      >
        <DialogContent className="sm:max-w-[350px]">
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
                    await editMessage(
                      editingMessage.id || "",
                      editText,
                      currentUserId
                    )
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
    </>
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
  const { deleteMessage } = useEditDelete(message.id || "", currentUserId)

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
      className={`group flex gap-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {message.displayName.charAt(0).toUpperCase()}
      </div>

      <div className={`min-w-0 flex-1 ${isOwnMessage ? "text-right" : ""}`}>
        <div
          className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-left ${
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          } ${message.isDeleted ? "italic opacity-60" : ""}`}
        >
          <div className="mb-0.5 flex items-center gap-1.5">
            <span className="text-xs font-semibold">{message.displayName}</span>
            <span className="text-[10px] opacity-70">
              {message.createdAt
                ? formatDistanceToNow(message.createdAt.toDate(), {
                    addSuffix: true,
                  })
                : "just now"}
            </span>
            {message.editedAt && (
              <span className="text-[10px] opacity-50">(edited)</span>
            )}
          </div>

          {replyMessage && (
            <div
              className={`mb-1.5 rounded p-1.5 text-[10px] ${
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
                className="h-5 rounded-full px-1.5 text-xs"
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
                  className="h-5 w-5 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
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
                      className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-muted"
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
                  className="h-5 w-5 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onReply}>
                  <Reply className="mr-2 h-3 w-3" />
                  Reply
                </DropdownMenuItem>
                {isOwnMessage && (
                  <>
                    <DropdownMenuItem onClick={() => onStartEdit(message)}>
                      <Pencil className="mr-2 h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteMessage.mutate()}
                      className="text-destructive"
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
