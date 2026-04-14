"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimateInViewProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "scale"
  once?: boolean
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
}

export function AnimateInView({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: AnimateInViewProps) {
  const variants = directionVariants[direction]

  return (
    <motion.div
      className={className}
      initial={variants.hidden}
      whileInView={variants.visible}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
