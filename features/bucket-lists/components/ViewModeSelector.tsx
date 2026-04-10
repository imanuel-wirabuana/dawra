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
  icon: React.ComponentType<{ className?: string }>
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
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 w-7 shrink-0 rounded-md p-0 text-muted-foreground transition-all duration-150 hover:bg-primary/10 hover:text-primary",
            className
          )}
        >
          {(() => {
            const currentOption = viewModeOptions.find(
              (option) => option.mode === viewMode
            )
            return currentOption ? (
              <currentOption.icon className="h-3.5 w-3.5" />
            ) : null
          })()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="end">
        <div className="flex flex-col">
          {viewModeOptions.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-150",
                viewMode === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
