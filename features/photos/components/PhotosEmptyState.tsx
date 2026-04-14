"use client"

import { motion } from "framer-motion"
import { Camera, Upload, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PhotosEmptyStateProps {
  onUploadClick?: () => void
}

export default function PhotosEmptyState({ onUploadClick }: PhotosEmptyStateProps) {
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
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/20 to-violet-500/10 shadow-lg"
        >
          <Camera className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
        >
          <Heart className="h-4 w-4 fill-current" />
        </motion.div>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-foreground">
        No memories yet
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Start capturing your journey together. Upload photos from your adventures and special moments.
      </p>

      {onUploadClick && (
        <Button
          onClick={onUploadClick}
          className="h-10 gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
        >
          <Upload className="h-4 w-4" />
          Upload Photos
        </Button>
      )}
    </motion.div>
  )
}
