"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { staggerContainer, staggerItem } from "@/lib/animations"

interface MasonryGridProps {
  children: React.ReactNode[]
  columns?: number
  gap?: number
  className?: string
  animate?: boolean
}

export function MasonryGrid({
  children,
  columns = 3,
  gap = 16,
  className,
  animate = true,
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnHeights, setColumnHeights] = useState<number[]>(
    new Array(columns).fill(0)
  )
  const [items, setItems] = useState<
    { child: React.ReactNode; column: number; top: number; index: number }[]
  >([])

  // Distribute items into columns using the shortest column algorithm
  useEffect(() => {
    const childArray = Array.isArray(children) ? children : [children]
    const heights = new Array(columns).fill(0)
    const distributed = childArray.map((child, index) => {
      // Find the shortest column
      const shortestColumn = heights.indexOf(Math.min(...heights))
      const top = heights[shortestColumn]

      // Estimate height (will be refined after render)
      // Use a default estimate or the child's intrinsic height if available
      const estimatedHeight = 200 + (index % 3) * 50 // Varied heights for visual interest

      heights[shortestColumn] += estimatedHeight + gap

      return { child, column: shortestColumn, top, index }
    })

    queueMicrotask(() => {
      setColumnHeights(heights)
      setItems(distributed)
    })
  }, [children, columns, gap])

  if (animate) {
    return (
      <motion.div
        ref={containerRef}
        className={cn("relative", className)}
        style={{ minHeight: Math.max(...columnHeights) }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {items.map(({ child, column, top, index }) => (
          <motion.div
            key={index}
            variants={staggerItem}
            className="absolute w-full"
            style={{
              top,
              left: `${(column / columns) * 100}%`,
              width: `${100 / columns}%`,
              paddingLeft: column === 0 ? 0 : gap / 2,
              paddingRight: column === columns - 1 ? 0 : gap / 2,
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ minHeight: Math.max(...columnHeights) }}
    >
      {items.map(({ child, column, top, index }) => (
        <div
          key={index}
          className="absolute w-full"
          style={{
            top,
            left: `${(column / columns) * 100}%`,
            width: `${100 / columns}%`,
            paddingLeft: column === 0 ? 0 : gap / 2,
            paddingRight: column === columns - 1 ? 0 : gap / 2,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// CSS-based masonry using columns (simpler but less control)
interface CSSMasonryProps {
  children: React.ReactNode
  columns?: number
  gap?: number
  className?: string
}

export function CSSMasonry({
  children,
  columns = 3,
  gap = 16,
  className,
}: CSSMasonryProps) {
  return (
    <div
      className={cn(className)}
      style={{
        columnCount: columns,
        columnGap: gap,
      }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className="mb-4 break-inside-avoid"
              style={{ marginBottom: gap }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  )
}
