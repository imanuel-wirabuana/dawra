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
    <Card className={cn("mb-4 p-4", className)}>
      <div
        className={cn(
          "rounded-lg border-2 border-dashed p-4 text-center transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">
              Drop photos here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Support for JPG, PNG, GIF (max 10MB per file)
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-8 gap-2 px-3 text-sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-3 w-3" />
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
