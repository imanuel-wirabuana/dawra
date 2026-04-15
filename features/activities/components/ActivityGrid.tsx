"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityList } from "./ActivityList"

export function ActivityGrid() {
  return (
    <Card className="overflow-hidden border-border/60 shadow-lg shadow-black/5">
      <CardHeader className="border-b border-border/50 bg-linear-to-b from-muted/50 to-muted/20 px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ActivityList />
      </CardContent>
    </Card>
  )
}
