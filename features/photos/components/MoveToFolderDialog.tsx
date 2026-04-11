"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Folder, MoveRight, Loader2, FolderOpen, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Folder as FolderType } from "@/types"

interface MoveToFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folders: FolderType[]
  selectedCount: number
  onMove: (folderId: string | null) => void
  currentFolderId?: string
}

export default function MoveToFolderDialog({
  open,
  onOpenChange,
  folders,
  selectedCount,
  onMove,
  currentFolderId,
}: MoveToFolderDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  // Filter out current folder from the list
  const availableFolders = currentFolderId
    ? folders.filter((f) => f.id !== currentFolderId)
    : folders

  // Get current folder name for display
  const currentFolder = currentFolderId
    ? folders.find((f) => f.id === currentFolderId)
    : null

  const handleMove = async () => {
    setIsMoving(true)
    try {
      await onMove(selectedFolderId)
      setSelectedFolderId(null)
      onOpenChange(false)
    } finally {
      setIsMoving(false)
    }
  }

  const handleClose = () => {
    if (!isMoving) {
      setSelectedFolderId(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {currentFolder
              ? `Move from "${currentFolder.name}"`
              : "Move to Folder"}
          </DialogTitle>
          <DialogDescription>
            Move {selectedCount} photo{selectedCount !== 1 ? "s" : ""}{" "}
            {currentFolder
              ? "to another folder or remove from current folder"
              : "to a folder"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto py-4">
          {/* Remove from current folder option */}
          {currentFolder && (
            <Card
              className={`cursor-pointer p-4 transition-colors ${
                selectedFolderId === null
                  ? "border-primary bg-primary/10"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedFolderId(null)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-destructive/10 p-2">
                  <FolderOpen className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">
                    Remove from &quot;{currentFolder.name}&quot;
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Move photos to unassigned (All Photos)
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Move to another folder - only show if there are available folders */}
          {availableFolders.length > 0 && (
            <>
              {currentFolder && (
                <p className="px-1 pt-2 text-xs font-medium text-muted-foreground">
                  Move to another folder
                </p>
              )}
              {availableFolders.map((folder) => (
                <Card
                  key={folder.id}
                  className={`cursor-pointer p-4 transition-colors ${
                    selectedFolderId === folder.id
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Folder className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{folder.name}</p>
                      {folder.description && (
                        <p className="text-xs text-muted-foreground">
                          {folder.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}

          {/* No folders available */}
          {availableFolders.length === 0 && !currentFolder && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No folders available. Create a folder first.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isMoving}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={
              isMoving || (availableFolders.length === 0 && !currentFolder)
            }
          >
            {isMoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Moving...
              </>
            ) : (
              <>
                <MoveRight className="mr-2 h-4 w-4" />
                Move
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
