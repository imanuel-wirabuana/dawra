"use client"

import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoadingState() {
  return (
    <Card className="p-12 text-center">
      <div className="mx-auto mb-4 rounded-full bg-muted/50 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium">Loading photos...</h3>
      <p className="text-muted-foreground">
        Fetching your memories from the cloud
      </p>
    </Card>
  )
}
