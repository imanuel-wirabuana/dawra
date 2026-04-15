"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

import { cn } from "@/lib/utils"
import Image from "next/image"

type BrandSize = "sm" | "md" | "lg"

interface BrandProps {
  className?: string
  size?: BrandSize
}

const SIZE_CLASSES: Record<
  BrandSize,
  { badge: string; text: string; gap: string }
> = {
  sm: {
    badge: "h-7 w-7 text-base sm:h-8 sm:w-8 sm:text-lg",
    text: "text-2xl sm:text-3xl",
    gap: "gap-1.5",
  },
  md: {
    badge: "h-9 w-9 text-lg sm:h-10 sm:w-10 sm:text-xl",
    text: "text-3xl sm:text-4xl",
    gap: "gap-2",
  },
  lg: {
    badge: "h-12 w-12 text-2xl sm:h-14 sm:w-14 sm:text-3xl",
    text: "text-5xl sm:text-6xl",
    gap: "gap-3",
  },
}

const LETTERS = ["D", "a", "w", "r", "a"]

function Sparkle({ delay, size }: { delay: number; size: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full bg-primary"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -20, -40],
        x: [0, 15, 30],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    />
  )
}

export function Brand({ className, size = "md" }: BrandProps) {
  const [isHovered, setIsHovered] = useState(false)
  const sizes = SIZE_CLASSES[size]

  return (
    <Link
      href="/"
      className={cn(
        "group relative flex items-center",
        "transition-all duration-300",
        sizes.gap,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated D Badge */}
      <motion.span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-2xl font-bold text-primary-foreground",

          "shadow-lg shadow-primary/30",
          sizes.badge
        )}
        animate={{
          y: isHovered ? [0, -6, 0] : [0, -3, 0],
          scale: isHovered ? [1, 1.1, 1] : 1,
          rotate: isHovered ? [0, -5, 5, 0] : 0,
        }}
        transition={{
          y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.6, ease: "easeOut" },
          rotate: { duration: 0.6, ease: "easeOut" },
        }}
      >
        <Image
          src="/icon/android-chrome-192x192.png"
          alt="D"
          width={24}
          height={24}
        />
        <span className="absolute inset-0 rounded-2xl bg-linear-to-tr from-white/20 to-transparent" />
        {/* Outer pulse ring */}
        <motion.span
          className="absolute -inset-1 rounded-2xl border-2 border-primary/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.span>

      {/* Dawra Text with Letter Stagger */}
      <span className={cn("flex items-center font-(--font-brand)", sizes.text)}>
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            className={cn(
              "inline-block text-foreground transition-colors",
              i === 0 ? "text-primary" : "group-hover:text-primary"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: isHovered ? [0, -8, 0] : 0,
            }}
            transition={{
              opacity: { delay: i * 0.05, duration: 0.4 },
              y: isHovered
                ? { delay: i * 0.03, duration: 0.5, ease: "easeOut" }
                : { duration: 0.3 },
            }}
            style={{ originY: 1 }}
          >
            {letter}
          </motion.span>
        ))}
      </span>

      {/* Sparkle Effects on Hover */}
      {isHovered && (
        <>
          <Sparkle delay={0} size={4} />
          <Sparkle delay={0.2} size={3} />
          <Sparkle delay={0.4} size={5} />
          <Sparkle delay={0.6} size={3} />
          <Sparkle delay={0.8} size={4} />
        </>
      )}

      {/* Glow effect */}
      <motion.span
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl"
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  )
}
