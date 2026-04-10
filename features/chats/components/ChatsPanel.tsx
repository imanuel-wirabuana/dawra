"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Smile, X, Pencil, Send, Loader2 } from "lucide-react"
import { useAddChatMessage } from "../hooks/useAddChatMessage"
import { useRealtimeChats } from "../hooks/useRealtimeChats"
import { useChannels } from "../hooks/useChannels"
import { useCreateChannel } from "../hooks/useCreateChannel"
import { useSearchMessages } from "../hooks/useSearchMessages"
import { useTyping } from "../hooks/useTyping"
import { useReactions } from "../hooks/useReactions"
import { useEditDelete } from "../hooks/useEditDelete"
import { editMessage } from "../services/edit-delete.service"
import type { Channel, ChatMessage } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Reply, Trash2, Hash, Plus, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface ChatsPanelProps {
  className?: string
}

export default function ChatsPanel({ className }: ChatsPanelProps) {
  const [currentUserId] = useState(generateUserId)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [editText, setEditText] = useState("")
  const [isNewChannelDialogOpen, setIsNewChannelDialogOpen] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelDesc, setNewChannelDesc] = useState("")

  const { channels, loading: channelsLoading } = useChannels()
  const { messages, loading: messagesLoading } = useRealtimeChats(
    selectedChannel?.id || ""
  )
  const addChatMessage = useAddChatMessage(selectedChannel?.id || "")
  const createChannel = useCreateChannel()
  const filteredMessages = useSearchMessages(messages, searchQuery)

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [filteredMessages, typingUsers])

  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value)
      updateTyping(value.length > 0)
    },
    [updateTyping]
  )

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

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return
    await createChannel.mutateAsync({
      name: newChannelName.trim(),
      description: newChannelDesc.trim() || undefined,
      createdBy: currentUserId,
    })
    setNewChannelName("")
    setNewChannelDesc("")
    setIsNewChannelDialogOpen(false)
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
        "flex h-fit min-h-125 items-stretch overflow-hidden rounded-xl border border-border bg-card shadow-lg",
        className
      )}
    >
      <div className="flex min-h-0 w-64 flex-col border-r border-border bg-muted/30">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Channels</h2>
          <Dialog
            open={isNewChannelDialogOpen}
            onOpenChange={setIsNewChannelDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Channel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
                <Input
                  placeholder="Description (optional)"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                />
                <Button
                  onClick={handleCreateChannel}
                  disabled={!newChannelName.trim() || createChannel.isPending}
                  className="w-full"
                >
                  {createChannel.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Channel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
          {channelsLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading...</p>
          ) : channels.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No channels yet</p>
          ) : (
            channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
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
      </div>

      <div className="flex h-full min-h-0 flex-1 flex-col">
        {selectedChannel ? (
          <>
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Hash className="h-5 w-5" />
                  {selectedChannel.name}
                </h2>
                {selectedChannel.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedChannel.description}
                  </p>
                )}
              </div>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9"
                />
              </div>
            </div>

            <div className="h-120">
              <ScrollArea className="h-full flex-1 p-4">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <p className="text-sm text-muted-foreground">
                      Loading messages...
                    </p>
                  ) : filteredMessages.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      {searchQuery
                        ? "No messages found"
                        : "No messages yet. Start the conversation!"}
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
            </div>

            {typingUsers.length > 0 && (
              <div className="px-4 py-2 text-xs text-muted-foreground italic">
                {formatTypingIndicator()}
              </div>
            )}

            {replyTo && (
              <div className="flex items-center justify-between border-t border-border bg-muted/50 px-4 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Reply className="h-4 w-4" />
                  <span className="text-muted-foreground">Replying to</span>
                  <span className="font-medium">{replyTo.displayName}</span>
                  <span className="max-w-50 truncate text-muted-foreground">
                    {replyTo.message}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setReplyTo(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-3 border-t border-border p-4"
            >
              <div className="flex gap-3">
                <Input
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-40 shrink-0"
                  disabled={addChatMessage.isPending}
                />
                <div className="flex flex-1 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="ghost" size="icon">
                        <Smile className="h-5 w-5" />
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
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    disabled={addChatMessage.isPending}
                    rows={1}
                    className="min-h-10 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                {addChatMessage.error && (
                  <p className="text-sm text-destructive">
                    {addChatMessage.error.message}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={addChatMessage.isPending || !message.trim()}
                >
                  {addChatMessage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a channel to start chatting
          </div>
        )}
      </div>

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
  const { deleteMessage } = useEditDelete(message.id || "", currentUserId)

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
                      className="flex h-8 w-8 items-center justify-center rounded text-lg transition-colors hover:bg-muted"
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
