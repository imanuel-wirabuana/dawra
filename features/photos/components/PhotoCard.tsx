"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Loader2 } from "lucide-react"
import type { Photo } from "@/types"

interface PhotoCardProps {
  photo: Photo
  onRemove: (id: string) => void
  isDeleting?: boolean
}

export default function PhotoCard({
  photo,
  onRemove,
  isDeleting,
}: PhotoCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-transform hover:scale-105">
      <div className="relative">
        <Image
          src={`https://lh3.googleusercontent.com/d/${photo.id}=s0`}
          alt={photo.realFileName || "Photo"}
          width={500}
          height={500}
          unoptimized
          className="h-auto w-full"
        />
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onRemove(photo.id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <X className="h-3 w-3" />
        )}
      </Button>
      <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/60 to-transparent p-2">
        <p className="truncate text-xs text-white">{photo.realFileName}</p>
        <p className="text-xs text-white/80">
          {photo.extension.toUpperCase()} •{" "}
          {(photo.size / 1024 / 1024).toFixed(1)}MB
        </p>
      </div>
    </Card>
  )
}
