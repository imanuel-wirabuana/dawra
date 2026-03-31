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
          variant="ghost"
          size="sm"
          className="h-9 shrink-0 gap-1.5 rounded-full px-4 text-muted-foreground hover:text-foreground"
          onClick={onCreateFolder}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">New folder</span>
        </Button>

        <div className="mx-2 h-5 w-px shrink-0 bg-border" />

        {/* Folder Pills */}
        {folders.map((folder) => (
          <div key={folder.id} className="group relative shrink-0">
            <Link
              href={`/photos/${folder.id}`}
              className="flex flex-col items-center gap-2 rounded bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-primary" />
                <span className="max-w-40 truncate">{folder.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({getPhotoCount(folder.id)})
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
