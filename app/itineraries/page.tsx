"use client"

import ItineraryGrid from "@/features/itineraries/components/ItineraryGrid"
import ItineraryGridSkeleton from "@/features/itineraries/components/ItineraryGridSkeleton"
import { Suspense } from "react"
import { Calendar } from "lucide-react"

export default function Page() {
  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Itineraries</h1>
        </div>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          Plan your daily activities and schedule your travel adventures.
        </p>
      </div>
      <Suspense fallback={<ItineraryGridSkeleton />}>
        <ItineraryGrid />
      </Suspense>
    </div>
  )
}
