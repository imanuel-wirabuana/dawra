"use client"

import { useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react"
import type { Photo } from "@/types"

interface PhotoGalleryModalProps {
  photos: Photo[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function PhotoGalleryModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: PhotoGalleryModalProps) {
  const currentPhoto = photos[currentIndex]

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1)
    } else {
      onNavigate(photos.length - 1) // Loop to end
    }
  }, [currentIndex, photos.length, onNavigate])

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1)
    } else {
      onNavigate(0) // Loop to start
    }
  }, [currentIndex, photos.length, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case "Escape":
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, handlePrevious, handleNext, onClose])

  const handleDownload = () => {
    if (currentPhoto?.url) {
      const link = document.createElement("a")
      link.href = currentPhoto.url
      link.download = currentPhoto.realFileName || currentPhoto.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!currentPhoto) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="h-auto max-h-[95vh] w-[95vw] !max-w-[95vw] border-none bg-black/95 p-0"
      >
        <DialogTitle className="sr-only">
          {currentPhoto.realFileName || "Photo viewer"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          View and navigate through photos in the gallery
        </DialogDescription>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Download button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-16 z-50 text-white hover:bg-white/20"
          onClick={handleDownload}
        >
          <Download className="h-5 w-5" />
        </Button>

        {/* Main image container */}
        <div className="relative flex h-[85vh] w-full items-center justify-center px-20">
          {/* Previous button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-50 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://lh3.googleusercontent.com/d/${currentPhoto.id}=s0`}
            alt={currentPhoto.realFileName || "Photo"}
            className="max-h-full max-w-full object-contain"
            loading="eager"
          />

          {/* Next button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-50 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={handleNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Footer info */}
        <div className="absolute right-0 bottom-0 left-0 bg-black/80 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentPhoto.realFileName}</p>
              <p className="text-sm text-white/70">
                {currentIndex + 1} of {photos.length} •{" "}
                {currentPhoto.extension.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
