"use client"

import Image from "next/image"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Loader2, Check, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Photo, Folder as FolderType } from "@/types"
import Link from "next/link"

interface PhotoCardProps {
  photo: Photo
  folders?: FolderType[]
  onRemove?: (id: string) => void
  isDeleting?: boolean
  isSelected?: boolean
  isSelectionMode?: boolean
  onSelect?: (e: React.MouseEvent, id: string) => void
}

export default function PhotoCard({
  photo,
  folders = [],
  onRemove,
  isDeleting,
  isSelected,
  isSelectionMode,
  onSelect,
}: PhotoCardProps) {
  // Look up folder name if photo has folderId
  const folder = useMemo(() => {
    if (!photo.folderId || !folders.length) return null
    return folders.find((f) => f.id === photo.folderId) || null
  }, [photo.folderId, folders])
  const handleClick = (e: React.MouseEvent) => {
    if (isSelectionMode && onSelect) {
      onSelect(e, photo.id)
    }
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all",
        isSelectionMode && "cursor-pointer",
        isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:scale-105"
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <Image
          src={`https://lh3.googleusercontent.com/d/${photo.id}=s0`}
          alt={photo.realFileName || "Photo"}
          width={500}
          height={500}
          unoptimized
          className="h-auto w-full"
        />

        {/* Selection Overlay */}
        {isSelectionMode && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-colors",
              isSelected
                ? "bg-primary/30"
                : "bg-black/0 group-hover:bg-black/20"
            )}
          >
            {isSelected && (
              <div className="rounded-full bg-primary p-2 shadow-lg">
                <Check className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Remove Button - only in non-selection mode */}
      {!isSelectionMode && onRemove && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(photo.id)
          }}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* File Info */}
      <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/60 to-transparent p-2">
        <p className="truncate text-xs text-white">{photo.realFileName}</p>
        <div className="flex items-center gap-1 text-xs text-white/80">
          {folder && (
            <Link
              href={`/photos/${folder.id}`}
              className="flex items-center gap-1"
            >
              <Folder className="h-3 w-3" />
              <span className="max-w-25 truncate">{folder.name}</span>
              <span>•</span>
            </Link>
          )}
          <span>{photo.extension.toUpperCase()}</span>
          <span>•</span>
          <span>{(photo.size / 1024 / 1024).toFixed(1)}MB</span>
        </div>
      </div>
    </Card>
  )
}
