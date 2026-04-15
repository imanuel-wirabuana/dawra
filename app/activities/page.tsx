"use client"

import { ActivityGrid } from "@/features/activities/components/ActivityGrid"
import { ActivityGridSkeleton } from "@/features/activities/components/ActivityGridSkeleton"
import { Suspense } from "react"
import { History, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function Page() {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 sm:mb-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-500/10 shadow-sm">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Activities
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Track what you&apos;ve been up to
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-4 py-2 backdrop-blur-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Real-time
            </span>
          </div>
        </div>
      </motion.div>
      <Suspense fallback={<ActivityGridSkeleton />}>
        <ActivityGrid />
      </Suspense>
    </div>
  )
}
