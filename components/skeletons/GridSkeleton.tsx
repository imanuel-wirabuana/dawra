"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GridSkeletonProps {
  className?: string
  columns?: number
  rows?: number
  gap?: string
}

export function GridSkeleton({
  className,
  columns = 3,
  rows = 2,
  gap = "gap-4",
}: GridSkeletonProps) {
  const items = Array.from({ length: columns * rows })

  return (
    <div
      className={cn(
        "grid",
        gap,
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {items.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
            className="aspect-square rounded-xl bg-muted"
          />
        </motion.div>
      ))}
    </div>
  )
}
