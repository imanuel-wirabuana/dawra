"use client"

import { Card } from "@/components/ui/card"
import { Image as ImageIcon } from "lucide-react"

interface EmptyStateProps {
  message?: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="mx-auto mb-4 rounded-full bg-muted/50 p-6">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium">No photos yet</h3>
      <p className="text-muted-foreground">
        {message || "Start uploading photos to build your memory wall"}
      </p>
    </Card>
  )
}
