"use client"

import ItineraryGrid from "@/features/itineraries/components/ItineraryGrid"
import { Suspense } from "react"
import { Calendar } from "lucide-react"

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Itineraries</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Plan your daily activities and schedule your travel adventures.
        </p>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <ItineraryGrid />
      </Suspense>
    </div>
  )
}
