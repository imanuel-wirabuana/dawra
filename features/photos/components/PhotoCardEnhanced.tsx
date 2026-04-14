"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Heart, Maximize2, Info } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import type { Photo } from "@/types"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PhotoCardEnhancedProps {
  photo: Photo
  isSelected?: boolean
  onSelect?: () => void
  onClick?: () => void
  isSelectionMode?: boolean
  index?: number
  layout?: "grid" | "masonry"
}

export default function PhotoCardEnhanced({
  photo,
  isSelected,
  onSelect,
  onClick,
  isSelectionMode,
  index = 0,
  layout = "grid",
}: PhotoCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showExif, setShowExif] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleClick = () => {
    if (isSelectionMode && onSelect) {
      onSelect()
    } else if (onClick) {
      onClick()
    }
  }

  const handleLongPress = () => {
    if (!isSelectionMode && onSelect) {
      onSelect()
    }
  }

  // Long press detection
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const startLongPress = () => {
    longPressTimer.current = setTimeout(handleLongPress, 500)
  }
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={startLongPress}
      onMouseUp={cancelLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer",
        layout === "masonry" && "mb-4 break-inside-avoid",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <GlassCard
        blur="sm"
        border="subtle"
        hover={false}
        className={cn(
          "overflow-hidden",
          layout === "masonry" ? "rounded-xl" : "aspect-square rounded-xl"
        )}
      >
        {/* Glare Effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.2) 0%, transparent 50%)`
            ),
          }}
        />

        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden",
            layout === "masonry" ? "w-full" : "aspect-square"
          )}
        >
          <Image
            src={photo.url}
            alt={photo.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading={index < 8 ? "eager" : "lazy"}
          />

          {/* Selection Overlay */}
          {isSelectionMode && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-white/70 bg-black/20"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-3 w-3 rounded-full bg-white"
                  />
                )}
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {/* Top Actions */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFavorited(!isFavorited)
                    }}
                  >
                    <motion.div
                      animate={isFavorited ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          isFavorited && "fill-red-500 text-red-500"
                        )}
                      />
                    </motion.div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Favorite</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation()
                      onClick?.()
                    }}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
              </Tooltip>
            </div>

            {/* Bottom Info */}
            <div className="absolute right-0 bottom-0 left-0 p-3">
              <p className="truncate text-sm font-medium text-white">
                {photo.name}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-white/70">
                {photo.size && (
                  <span>{(photo.size / 1024 / 1024).toFixed(1)} MB</span>
                )}
                {photo.extension && (
                  <span>{photo.extension.toUpperCase()}</span>
                )}
              </div>
            </div>

            {/* EXIF Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 bottom-3 h-6 px-2 text-xs text-white/70 hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                setShowExif(!showExif)
              }}
            >
              <Info className="mr-1 h-3 w-3" />
              EXIF
            </Button>
          </div>

          {/* EXIF Data Panel */}
          {showExif && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 flex flex-col justify-center bg-black/80 p-4 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3 text-sm text-white">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Info className="h-4 w-4" />
                  Photo Details
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">Name</span>
                    <span className="max-w-32 truncate">{photo.name}</span>
                  </div>
                  {photo.size && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Size</span>
                      <span>{(photo.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  )}
                  {photo.extension && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Format</span>
                      <span>{photo.extension.toUpperCase()}</span>
                    </div>
                  )}
                  {photo.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Date</span>
                      <span>
                        {photo.createdAt.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full text-white/70 hover:bg-white/20 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowExif(false)
                  }}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}
