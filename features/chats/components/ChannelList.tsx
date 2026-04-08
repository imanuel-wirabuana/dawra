"use client"

import { Plus, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { useChannels } from "../hooks/useChannels"
import { useCreateChannel } from "../hooks/useCreateChannel"
import type { Channel } from "@/types"

interface ChannelListProps {
  selectedChannel: Channel | null
  onSelectChannel: (channel: Channel) => void
  currentUserId: string
}

export function ChannelList({
  selectedChannel,
  onSelectChannel,
  currentUserId,
}: ChannelListProps) {
  const { channels, loading } = useChannels()
  const createChannel = useCreateChannel()
  const [isOpen, setIsOpen] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelDesc, setNewChannelDesc] = useState("")

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return

    await createChannel.mutateAsync({
      name: newChannelName,
      description: newChannelDesc,
      createdBy: currentUserId,
    })

    setNewChannelName("")
    setNewChannelDesc("")
    setIsOpen(false)
  }

  return (
    <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg">Channels</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                Create Channel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading channels...</p>
        ) : channels.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No channels yet</p>
        ) : (
          <div className="p-2 space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedChannel?.id === channel.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Hash className="h-4 w-4" />
                <div className="flex-1 text-left">
                  <p className="font-medium truncate">{channel.name}</p>
                  {channel.description && (
                    <p className="text-xs opacity-80 truncate">{channel.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
