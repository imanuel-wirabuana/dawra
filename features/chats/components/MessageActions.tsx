"use client"

import { MoreVertical, Pencil, Reply, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface MessageActionsProps {
  messageId: string
  userId: string
  currentUserId: string
  isDeleted?: boolean
  onReply: () => void
  onEdit: () => void
  onDelete: () => void
}

export function MessageActions({
  userId,
  currentUserId,
  isDeleted,
  onReply,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  const isOwnMessage = userId === currentUserId

  if (isDeleted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onReply}>
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </DropdownMenuItem>
        {isOwnMessage && (
          <>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
