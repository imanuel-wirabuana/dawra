"use client"

import ItineraryGrid from "@/features/itineraries/components/ItineraryGrid"
import ItineraryGridSkeleton from "@/features/itineraries/components/ItineraryGridSkeleton"
import { Suspense } from "react"
import { Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export default function Page() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 sm:mb-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 shadow-sm">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Itineraries
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Adventures we plan together
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-4 py-2 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Travel Plans
            </span>
          </div>
        </div>
      </motion.div>
      <Suspense fallback={<ItineraryGridSkeleton />}>
        <ItineraryGrid />
      </Suspense>
    </div>
  )
}
