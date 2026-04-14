import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Bucket List</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-center">
          <DialogClose asChild>
            <Button variant="outline" className="min-w-25">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="min-w-25"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
