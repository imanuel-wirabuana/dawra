"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ShimmerSkeletonProps {
  className?: string
  count?: number
  variant?: "card" | "list" | "grid" | "text"
}

export function ShimmerSkeleton({ 
  className, 
  count = 3,
  variant = "card" 
}: ShimmerSkeletonProps) {
  const variants = {
    card: CardSkeleton,
    list: ListSkeleton,
    grid: GridSkeleton,
    text: TextSkeleton,
  }

  const SkeletonComponent = variants[variant]

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} delay={i * 0.1} />
      ))}
    </div>
  )
}

function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-xl border border-border/20 bg-card/50 p-4"
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{
          translateX: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        }}
      />
      
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
        <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
      </div>
    </motion.div>
  )
}

function ListSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-3 rounded-lg border border-border/20 bg-card/50"
    >
      <div className="h-4 w-4 rounded bg-muted animate-pulse" />
      <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
      </div>
    </motion.div>
  )
}

function GridSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="aspect-square rounded-xl border border-border/20 bg-card/50 p-3"
    >
      <div className="h-full w-full rounded-lg bg-muted animate-pulse" />
    </motion.div>
  )
}

function TextSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="space-y-2"
    >
      <div className="h-4 w-full bg-muted rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
      <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
    </motion.div>
  )
}

// Photo-specific skeleton
export function PhotoSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative aspect-square overflow-hidden rounded-xl bg-muted",
        className
      )}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%)",
            "linear-gradient(90deg, #f8f8f8 0%, #f0f0f0 50%, #f8f8f8 100%)",
            "linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%)",
          ],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-gray-300/50 animate-pulse" />
      </div>
    </motion.div>
  )
}

// Chat message skeleton
export function ChatSkeleton({ isMe = false }: { isMe?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 p-4",
        isMe && "flex-row-reverse"
      )}
    >
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
      <div className={cn("space-y-2 max-w-[70%]", isMe && "items-end")}>
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        <div className="h-16 w-48 bg-muted rounded-2xl animate-pulse" />
      </div>
    </motion.div>
  )
}

// Page header skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="py-8 space-y-4">
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <div className="h-4 w-96 bg-muted rounded animate-pulse" />
    </div>
  )
}
