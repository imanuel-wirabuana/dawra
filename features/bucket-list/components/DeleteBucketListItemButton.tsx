import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useDeleteBucketList } from "../hooks/useDeleteBucketList"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface DeleteBucketListItemButtonProps {
  itemId: string | undefined
  className?: string
}

export default function DeleteBucketListItemButton({
  itemId,
  className,
}: DeleteBucketListItemButtonProps) {
  const [open, setOpen] = useState(false)
  const deleteMutation = useDeleteBucketList()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (itemId) {
      deleteMutation.mutate(itemId)
    }
  }

  // Close dialog after successful deletion
  if (deleteMutation.isSuccess) {
    setOpen(false)
    deleteMutation.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          disabled={!itemId}
          className={`h-6 w-6 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this bucket list item? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
