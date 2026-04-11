import { Button } from "@/components/ui/button"
import { Trash2, X, Loader2 } from "lucide-react"
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

interface DeleteBucketListButtonProps {
  itemId: string | undefined
  className?: string
}

export default function DeleteBucketListButton({
  itemId,
  className,
}: DeleteBucketListButtonProps) {
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
          <DialogTitle>Delete Bucket List</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this bucket list? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
