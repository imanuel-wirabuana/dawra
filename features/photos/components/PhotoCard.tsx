"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { Check, Folder, Loader2, X } from "lucide-react"

import type { Folder as FolderType, Photo } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PhotoCardProps {
  photo: Photo
  folders?: FolderType[]
  onRemove?: (id: string) => void
  isDeleting?: boolean
  isSelected?: boolean
  isSelectionMode?: boolean
  onSelect?: (e: React.MouseEvent, id: string) => void
  className?: string
}

export default function PhotoCard({
  photo,
  folders = [],
  onRemove,
  isDeleting,
  isSelected,
  isSelectionMode,
  onSelect,
  className,
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
        "group relative overflow-hidden rounded-xl border-border/40 shadow-sm transition-all duration-300 ease-out",
        isSelectionMode && "cursor-pointer",
        isSelected
          ? "shadow-lg ring-2 shadow-primary/10 ring-primary ring-offset-2"
          : "hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10",
        className
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
              "absolute inset-0 flex items-center justify-center transition-all duration-200",
              isSelected
                ? "bg-primary/40"
                : "bg-black/0 group-hover:bg-black/30"
            )}
          >
            {isSelected && (
              <div className="scale-110 rounded-full bg-primary p-2.5 shadow-lg shadow-primary/30">
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
          className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(photo.id)
          }}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
        </Button>
      )}

      {/* File Info */}
      <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/70 via-black/30 to-transparent p-3 pt-8">
        <p className="truncate text-sm font-medium text-white drop-shadow-md">
          {photo.realFileName}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-white/90">
          {folder && (
            <Link
              href={`/photos/${folder.id}`}
              className="flex items-center gap-1 transition-colors hover:text-white"
            >
              <Folder className="h-3 w-3" />
              <span className="max-w-24 truncate">{folder.name}</span>
              <span className="text-white/60">•</span>
            </Link>
          )}
          <span className="uppercase">{photo.extension}</span>
          <span className="text-white/60">•</span>
          <span>{(photo.size / 1024 / 1024).toFixed(1)} MB</span>
        </div>
      </div>
    </Card>
  )
}
