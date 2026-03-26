import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { BucketList } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUpdateBucketList } from "../hooks/useUpdateBucketListItem"

interface UpdateBucketListItemButtonProps {
  itemId: string | undefined
  item: Partial<BucketList>
  className?: string
}

export default function UpdateBucketListItemButton({
  itemId,
  item,
  className,
}: UpdateBucketListItemButtonProps) {
  const [title, setTitle] = useState(item.title || "")
  const [description, setDescription] = useState(item.description || "")
  const [location, setLocation] = useState(item.location || "")
  const [open, setOpen] = useState(false)
  const updateMutation = useUpdateBucketList()

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (itemId && title.trim() && description.trim()) {
      updateMutation.mutate({
        id: itemId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || undefined,
      })
      setOpen(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset to original values when closing
      setTitle(item.title || "")
      setDescription(item.description || "")
      setLocation(item.location || "")
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={!itemId}
          className={`h-6 w-6 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium">Edit Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Title"
              className="h-8 text-xs"
              disabled={updateMutation.isPending}
            />
            <Textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Description"
              className="min-h-20 resize-none text-xs"
              disabled={updateMutation.isPending}
            />
            <Input
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
              placeholder="Location (Optional)"
              className="h-8 text-xs"
              disabled={updateMutation.isPending}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={
                updateMutation.isPending || !title.trim() || !description.trim()
              }
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
