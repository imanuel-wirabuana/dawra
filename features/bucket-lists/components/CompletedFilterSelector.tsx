"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Filter } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type CompletedFilter = "all" | "completed" | "incomplete"

interface CompletedFilterConfig {
  value: CompletedFilter
  label: string
  icon: React.ReactNode
}

const filterOptions: CompletedFilterConfig[] = [
  { value: "all", label: "All Items", icon: <Filter className="h-3 w-3" /> },
  {
    value: "completed",
    label: "Completed",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  {
    value: "incomplete",
    label: "Incomplete",
    icon: <Circle className="h-3 w-3" />,
  },
]

interface CompletedFilterSelectorProps {
  currentFilter: CompletedFilter
  onFilterChange: (filter: CompletedFilter) => void
  className?: string
}

export default function CompletedFilterSelector({
  currentFilter,
  onFilterChange,
  className,
}: CompletedFilterSelectorProps) {
  const [open, setOpen] = useState(false)

  const currentOption = filterOptions.find(
    (option) => option.value === currentFilter
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-all duration-150 hover:bg-primary/10 hover:text-primary",
            className
          )}
        >
          {currentOption?.icon || <Filter className="h-3 w-3" />}
          <span className="hidden sm:inline">
            {currentOption?.label || "Filter"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="end">
        <div className="flex flex-col">
          {filterOptions.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => {
                onFilterChange(value)
                setOpen(false)
              }}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-150",
                currentFilter === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span>{label}</span>
              <span
                className={cn(
                  currentFilter === value
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {icon}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
