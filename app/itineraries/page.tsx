"use client"

import ItineraryGrid from "@/features/itineraries/components/ItineraryGrid"
import { Suspense } from "react"

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Itineraries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan your daily activities and schedule your travel adventures.
        </p>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <ItineraryGrid />
      </Suspense>
    </div>
  )
}
