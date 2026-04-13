"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhotoUploadAreaProps {
  className?: string
  isUploading: boolean
  onUpload: (files: FileList) => void
}

export default function PhotoUploadArea({
  className,
  isUploading,
  onUpload,
}: PhotoUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files)
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/50 shadow-sm transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      <div
        className={cn(
          "p-6 text-center transition-all duration-200",
          dragActive
            ? "border-2 border-dashed border-primary bg-gradient-to-b from-primary/10 to-primary/5"
            : "border-2 border-dashed border-border/50 bg-gradient-to-b from-background to-muted/10 hover:border-primary/30"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-foreground">
              Drop photos here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Support for JPG, PNG, GIF (max 10MB per file)
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-9 gap-1.5 bg-primary px-4 font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Choose Photos
              </>
            )}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </Card>
  )
}
