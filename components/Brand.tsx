"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

type BrandSize = "sm" | "md" | "lg"

interface BrandProps {
  className?: string
  size?: BrandSize
}

const SIZE_CLASSES: Record<BrandSize, string> = {
  sm: "text-xl sm:text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-4xl sm:text-5xl",
}

export function Brand({ className, size = "md" }: BrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-1 font-semibold tracking-tight",
        "transition-all duration-300",
        SIZE_CLASSES[size],
        className
      )}
    >
      <motion.span
        whileHover={{ scale: 1.02 }}
        className="relative flex items-center"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-lg font-bold text-primary-foreground shadow-md shadow-primary/20 sm:h-9 sm:w-9 sm:text-xl">
          D
        </span>
        <span className="ml-2 text-foreground transition-colors group-hover:text-primary">
          awra
        </span>
      </motion.span>
    </Link>
  )
}
