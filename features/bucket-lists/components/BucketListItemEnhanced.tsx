"use client"

import { useState, useRef } from "react"
import {
  MapPin,
  MoreHorizontal,
  Wallet,
  Check,
  Trash2,
  Flag,
} from "lucide-react"
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion"

import type { BucketList } from "@/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import DeleteBucketListButton from "./DeleteBucketListButton"
import ToggleBucketListButton from "./ToggleBucketListButton"
import UpdateBucketListButton from "./UpdateBucketListButton"

interface BucketListItemEnhancedProps {
  item: Partial<BucketList>
  className?: string
  isSelected?: boolean
  onSelect?: (e: React.MouseEvent, id: string) => void
  isSelectionMode?: boolean
  onComplete?: (id: string, completed: boolean) => void
  onDelete?: (id: string) => void
  index?: number
}

type Priority = "high" | "medium" | "low"

const priorityConfig: Record<
  Priority,
  { color: string; label: string; icon: typeof Flag }
> = {
  high: { color: "#ef4444", label: "High", icon: Flag },
  medium: { color: "#f59e0b", label: "Medium", icon: Flag },
  low: { color: "#22c55e", label: "Low", icon: Flag },
}

export default function BucketListItemEnhanced({
  item,
  className,
  isSelected,
  onSelect,
  isSelectionMode,
  onComplete,
  onDelete,
  index = 0,
}: BucketListItemEnhancedProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Swipe thresholds
  const DELETE_THRESHOLD = -100
  const COMPLETE_THRESHOLD = 100

  // Transforms for swipe actions
  const deleteOpacity = useTransform(x, [DELETE_THRESHOLD, 0], [1, 0])
  const completeOpacity = useTransform(x, [0, COMPLETE_THRESHOLD], [0, 1])
  const deleteScale = useTransform(x, [DELETE_THRESHOLD, 0], [1, 0.8])
  const completeScale = useTransform(x, [0, COMPLETE_THRESHOLD], [0.8, 1])

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false)

    if (info.offset.x < DELETE_THRESHOLD && onDelete && item.id) {
      // Swiped left enough - trigger delete
      onDelete(item.id)
    } else if (info.offset.x > COMPLETE_THRESHOLD && onComplete && item.id) {
      // Swiped right enough - toggle complete
      onComplete(item.id, !item.completed)
    }
  }

  const handleItemClick = (e: React.MouseEvent) => {
    if (isDragging) return
    if (isSelectionMode && onSelect && item.id) {
      onSelect(e, item.id)
    }
  }

  // Determine priority (mock - would come from item data)
  const priority: Priority =
    item.cost && item.cost > 1000000
      ? "high"
      : item.cost && item.cost > 500000
        ? "medium"
        : "low"
  const priorityInfo = priorityConfig[priority]
  const PriorityIcon = priorityInfo.icon

  return (
    <div ref={constraintsRef} className="relative touch-pan-y">
      {/* Swipe Action Backgrounds */}
      <div className="absolute inset-0 flex items-center justify-between overflow-hidden rounded-xl px-4">
        {/* Complete Action (Right swipe) */}
        <motion.div
          className="absolute inset-y-0 left-0 flex w-full items-center justify-start bg-green-500/20 pl-4"
          style={{ opacity: completeOpacity }}
        >
          <motion.div
            className="flex items-center gap-2 text-green-600 dark:text-green-400"
            style={{ scale: completeScale }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-5 w-5" />
            </div>
            <span className="font-medium">
              {item.completed ? "Uncomplete" : "Complete"}
            </span>
          </motion.div>
        </motion.div>

        {/* Delete Action (Left swipe) */}
        <motion.div
          className="absolute inset-y-0 right-0 flex w-full items-center justify-end bg-red-500/20 pr-4"
          style={{ opacity: deleteOpacity }}
        >
          <motion.div
            className="flex items-center gap-2 text-red-600 dark:text-red-400"
            style={{ scale: deleteScale }}
          >
            <span className="font-medium">Delete</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
              <Trash2 className="h-5 w-5" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Card */}
      <motion.div
        drag={!isSelectionMode ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{
          duration: 0.35,
          delay: index * 0.05,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={
          !isSelectionMode ? { y: -2, transition: { duration: 0.2 } } : {}
        }
        className={cn(
          "relative flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 ease-out",
          isSelectionMode ? "cursor-pointer" : "cursor-default",
          isSelected
            ? "border-primary/50 bg-primary/5 shadow-md ring-1 shadow-primary/10 ring-primary/30"
            : "border-border/40 hover:border-primary/20 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5",
          className
        )}
        onClick={handleItemClick}
      >
        {/* Progress bar for completion */}
        <div className="absolute top-0 right-0 left-0 h-1 overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
          <motion.div
            className={cn(
              "h-full rounded-full",
              item.completed ? "bg-green-500" : "bg-primary"
            )}
            initial={{ width: 0 }}
            animate={{ width: item.completed ? "100%" : "0%" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          />
        </div>

        {/* Header: Title + Actions */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {/* Completion Toggle */}
            {!isSelectionMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 md:opacity-0"
              >
                <ToggleBucketListButton
                  itemId={item.id}
                  completed={item.completed}
                  title={item.title}
                />
              </motion.div>
            )}

            {/* Title Section */}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <motion.h3
                  layout
                  className={cn(
                    "text-sm leading-tight font-semibold tracking-tight transition-colors",
                    item.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  )}
                >
                  {item.title}
                </motion.h3>

                {/* Priority indicator */}
                <Badge
                  variant="outline"
                  className="h-5 shrink-0 px-1.5 text-[10px] font-medium"
                  style={{
                    borderColor: priorityInfo.color + "40",
                    color: priorityInfo.color,
                    backgroundColor: priorityInfo.color + "15",
                  }}
                >
                  <PriorityIcon className="mr-1 h-3 w-3" />
                  {priorityInfo.label}
                </Badge>
              </div>

              {/* Location subtitle */}
              {item.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "shrink-0 cursor-pointer rounded-md p-1.5 transition-all duration-150",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
                )}
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            </PopoverTrigger>

            <PopoverContent className="w-fit p-1.5" align="end">
              <div className="flex items-center gap-1">
                <UpdateBucketListButton itemId={item.id} item={item} />
                <DeleteBucketListButton itemId={item.id} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Description with expand */}
        {item.description && (
          <div className="relative">
            <p
              className={cn(
                "text-sm leading-relaxed text-muted-foreground transition-all",
                item.completed && "line-through opacity-60",
                !showFullDescription && "line-clamp-2"
              )}
            >
              {item.description}
            </p>
            {item.description.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFullDescription(!showFullDescription)
                }}
                className="mt-1 text-xs text-primary hover:underline"
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Cost */}
          {item.cost && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Wallet className="h-3 w-3 shrink-0" />
              <span>Rp {item.cost.toLocaleString("id-ID")}</span>
            </div>
          )}
        </div>

        {/* Categories */}
        {item.categories && item.categories.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.1 },
              },
            }}
            className="flex flex-wrap gap-1.5 pt-1"
          >
            {item.categories.map((category, catIndex) => (
              <motion.div
                key={category.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.2, delay: catIndex * 0.03 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs transition-shadow hover:shadow-sm"
                style={{
                  borderColor: `${category.color}40`,
                  backgroundColor: `${category.color}15`,
                }}
              >
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span style={{ color: category.color }}>{category.name}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Swipe hint for mobile */}
        <div className="mt-2 flex items-center justify-center gap-4 border-t border-border/20 pt-2 md:hidden">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-2.5 w-2.5 text-green-600" />
            </span>
            Swipe right to complete
          </span>
        </div>
      </motion.div>
    </div>
  )
}
