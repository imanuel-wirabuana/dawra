"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ViewMode } from "@/types"
import { Grid3X3, List, Grid2X2 } from "lucide-react"

interface ViewModeOption {
  mode: ViewMode
  icon: any
  label: string
}

const viewModeOptions: ViewModeOption[] = [
  { mode: "list", icon: List, label: "List" },
  { mode: "grid2", icon: Grid2X2, label: "Grid 2x2" },
  { mode: "grid3", icon: Grid3X3, label: "Grid 3x3" },
]

interface ViewModeSelectorProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export default function ViewModeSelector({
  viewMode,
  onViewModeChange,
  className,
}: ViewModeSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-7 px-2 text-xs", className)}
        >
          {(() => {
            const currentOption = viewModeOptions.find(
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
          {viewModeOptions.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                "flex items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-accent",
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
