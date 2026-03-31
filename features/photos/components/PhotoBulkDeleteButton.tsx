import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState, useImperativeHandle, forwardRef } from "react"
import { useDeletePhoto } from "../hooks/useDeletePhoto"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PhotoBulkDeleteButtonProps {
  selectedIds: string[]
  onDelete: () => void
  className?: string
}

export interface PhotoBulkDeleteButtonRef {
  triggerDelete: () => void
}

const PhotoBulkDeleteButton = forwardRef<
  PhotoBulkDeleteButtonRef,
  PhotoBulkDeleteButtonProps
>(({ selectedIds, onDelete, className }, ref) => {
  const [open, setOpen] = useState(false)
  const deleteMutation = useDeletePhoto()

  const handleBulkDelete = () => {
    // Delete all selected photos
    selectedIds.forEach((id) => {
      deleteMutation.mutateAsync(id).catch(console.error)
    })
    setOpen(false)
    onDelete()
  }

  // Expose triggerDelete method via ref
  useImperativeHandle(
    ref,
    () => ({
      triggerDelete: () => {
        if (selectedIds.length > 0) {
          setOpen(true)
        }
      },
    }),
    [selectedIds.length]
  )

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
          size="sm"
          disabled={selectedIds.length === 0}
          className={`h-7 text-xs ${className}`}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Photos</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedIds.length} photo
            {selectedIds.length !== 1 ? "s" : ""}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

PhotoBulkDeleteButton.displayName = "PhotoBulkDeleteButton"

export default PhotoBulkDeleteButton
