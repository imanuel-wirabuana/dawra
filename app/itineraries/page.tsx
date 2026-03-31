"use client"

import ItineraryGrid from "@/features/itineraries/components/ItineraryGrid"
import { Suspense } from "react"

export default function Page() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Itineraries</h1>
      <div className="flex flex-col">
        <Suspense fallback={<p>Loading...</p>}>
          <ItineraryGrid />
        </Suspense>
      </div>
    </div>
  )
}
