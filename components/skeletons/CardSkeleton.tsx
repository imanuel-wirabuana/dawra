"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardSkeletonProps {
  className?: string
  hasHeader?: boolean
  hasFooter?: boolean
  lines?: number
}

export function CardSkeleton({
  className,
  hasHeader = true,
  hasFooter = false,
  lines = 2,
}: CardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        {hasHeader && (
          <div className="border-b border-border/30 p-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-10 w-10 rounded-xl bg-muted"
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                  className="h-4 w-3/4 rounded bg-muted"
                />
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="h-3 w-1/2 rounded bg-muted"
                />
              </div>
            </div>
          </div>
        )}
        <div className="p-4 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className={cn(
                "h-3 rounded bg-muted",
                i === lines - 1 ? "w-2/3" : "w-full"
              )}
            />
          ))}
        </div>
        {hasFooter && (
          <div className="border-t border-border/30 p-4">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className="h-9 w-full rounded-lg bg-muted"
            />
          </div>
        )}
      </Card>
    </motion.div>
  )
}
