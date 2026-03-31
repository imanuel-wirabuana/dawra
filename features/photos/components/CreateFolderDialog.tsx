"use client"

import { useState } from "react"
import { useAddFolder } from "../hooks/useAddFolder"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateFolderDialog({
  open,
  onOpenChange,
}: CreateFolderDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const addFolderMutation = useAddFolder()

  const handleCreate = async () => {
    if (!name.trim()) return

    await addFolderMutation.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
    })

    setName("")
    setDescription("")
    onOpenChange(false)
  }

  const handleClose = () => {
    if (!addFolderMutation.isPending) {
      setName("")
      setDescription("")
      onOpenChange(false)
    }
  }

  // Reset form on successful submission
  if (addFolderMutation.isSuccess) {
    addFolderMutation.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your photos
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={addFolderMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Enter folder description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={addFolderMutation.isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={addFolderMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || addFolderMutation.isPending}
          >
            {addFolderMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
