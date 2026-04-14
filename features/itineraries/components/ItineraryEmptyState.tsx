"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ItineraryEmptyStateProps {
  onAddClick?: () => void
}

export default function ItineraryEmptyState({ onAddClick }: ItineraryEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-card/50 px-8 py-16 text-center backdrop-blur-sm"
    >
      {/* Animated illustration */}
      <div className="relative mb-6">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 shadow-lg"
        >
          <Calendar className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div
          animate={{ x: [0, 4, 0], y: [0, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -top-1 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
        >
          <MapPin className="h-4 w-4 text-primary" />
        </motion.div>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-foreground">
        No plans yet
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Start planning your adventures together. Add activities, schedules, and destinations.
      </p>

      {onAddClick && (
        <Button
          onClick={onAddClick}
          className="h-10 gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Plan First Activity
        </Button>
      )}
    </motion.div>
  )
}
