"use client"

import Link from "next/link"
import { Folder, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Folder as FolderType } from "@/types"

interface FolderGridProps {
  folders: FolderType[]
  photos?: { folderId?: string }[]
  onCreateFolder: () => void
}

export default function FolderGrid({
  folders,
  photos = [],
  onCreateFolder,
}: FolderGridProps) {
  // Calculate photo count for each folder
  const getPhotoCount = (folderId: string) => {
    return photos.filter((p) => p.folderId === folderId).length
  }

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* Create Folder Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 rounded-full border-dashed border-border/60 px-3 text-xs font-medium text-muted-foreground transition-all duration-150 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          onClick={onCreateFolder}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New folder</span>
        </Button>

        <div className="mx-1 h-4 w-px shrink-0 bg-border/50" />

        {/* Folder Pills */}
        {folders.map((folder) => (
          <div key={folder.id} className="group relative shrink-0">
            <Link
              href={`/photos/${folder.id}`}
              className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-150 hover:border-primary/30 hover:bg-primary/5"
            >
              <Folder className="h-3.5 w-3.5 text-primary" />
              <span className="max-w-32 truncate">{folder.name}</span>
              <span className="text-xs text-muted-foreground">
                {getPhotoCount(folder.id)}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
