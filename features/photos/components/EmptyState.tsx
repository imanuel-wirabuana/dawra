"use client"

import { Card } from "@/components/ui/card"
import { Image as ImageIcon } from "lucide-react"

interface EmptyStateProps {
  message?: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <Card className="border-border/40 p-12 text-center shadow-sm transition-all duration-300 hover:border-primary/10 hover:shadow-md">
      <div className="mx-auto mb-4 rounded-full bg-linear-to-br from-muted/70 to-muted/30 p-6 shadow-inner">
        <ImageIcon className="h-8 w-8 text-muted-foreground/70" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        No photos yet
      </h3>
      <p className="text-sm text-muted-foreground/80">
        {message || "Start uploading photos to build your memory wall"}
      </p>
    </Card>
  )
}
