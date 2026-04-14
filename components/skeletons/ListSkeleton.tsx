"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ListSkeletonProps {
  className?: string
  items?: number
  showAvatar?: boolean
  showSubtitle?: boolean
}

export function ListSkeleton({
  className,
  items = 4,
  showAvatar = true,
  showSubtitle = true,
}: ListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex items-center gap-3 rounded-lg border border-border/40 p-3"
        >
          {showAvatar && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="h-10 w-10 shrink-0 rounded-lg bg-muted"
            />
          )}
          <div className="flex-1 space-y-2">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1 + 0.05,
              }}
              className="h-4 w-3/4 rounded bg-muted"
            />
            {showSubtitle && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1 + 0.1,
                }}
                className="h-3 w-1/2 rounded bg-muted"
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
