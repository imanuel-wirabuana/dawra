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
import { X, Plus, Loader2, Folder } from "lucide-react"

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-center">Create New Folder</DialogTitle>
          <DialogDescription className="text-center">
            Create a new folder to organize your photos
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium">
              Folder Name
            </Label>
            <Input
              id="name"
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={addFolderMutation.isPending}
              className="h-10 border-input/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-medium text-muted-foreground"
            >
              Description (optional)
            </Label>
            <Input
              id="description"
              placeholder="Enter folder description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={addFolderMutation.isPending}
              className="h-9 border-input/60 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-center">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={addFolderMutation.isPending}
            className="min-w-25"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || addFolderMutation.isPending}
            className="min-w-[100px] bg-primary"
          >
            {addFolderMutation.isPending ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-4 w-4" />
                Create
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
