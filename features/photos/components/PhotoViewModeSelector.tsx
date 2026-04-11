"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Maximize2, Grid2X2, Grid3X3, LayoutDashboard } from "lucide-react"

export type PhotoViewMode = "full" | "grid2x2" | "grid3x3" | "masonry"

interface PhotoViewModeOption {
  mode: PhotoViewMode
  icon: React.ComponentType<{ className?: string }>
  label: string
}

const photoViewModeOptions: PhotoViewModeOption[] = [
  { mode: "full", icon: Maximize2, label: "Full" },
  { mode: "grid2x2", icon: Grid2X2, label: "Grid 2x2" },
  { mode: "grid3x3", icon: Grid3X3, label: "Grid 3x3" },
  { mode: "masonry", icon: LayoutDashboard, label: "Masonry" },
]

interface PhotoViewModeSelectorProps {
  viewMode: PhotoViewMode
  onViewModeChange: (mode: PhotoViewMode) => void
  className?: string
}

export default function PhotoViewModeSelector({
  viewMode,
  onViewModeChange,
  className,
}: PhotoViewModeSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-7 px-2 text-xs", className)}
        >
          {(() => {
            const currentOption = photoViewModeOptions.find(
              (option) => option.mode === viewMode
            )
            return currentOption ? (
              <currentOption.icon className="mr-1 h-3 w-3" />
            ) : null
          })()}
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="end">
        <div className="flex flex-col">
          {photoViewModeOptions.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-accent",
                viewMode === mode && "bg-accent"
              )}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
