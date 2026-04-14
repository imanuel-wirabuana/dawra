"use client"

import { motion } from "framer-motion"
import { Target, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BucketListEmptyStateProps {
  onAddClick?: () => void
}

export default function BucketListEmptyState({ onAddClick }: BucketListEmptyStateProps) {
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
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg"
        >
          <Target className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
        >
          <Sparkles className="h-4 w-4 text-primary/60" />
        </motion.div>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-foreground">
        No dreams yet
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Start building your bucket list together. Add your first dream or adventure goal.
      </p>

      {onAddClick && (
        <Button
          onClick={onAddClick}
          className="h-10 gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add First Dream
        </Button>
      )}
    </motion.div>
  )
}
