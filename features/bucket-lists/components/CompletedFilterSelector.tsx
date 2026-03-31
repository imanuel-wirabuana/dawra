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
  { value: "completed", label: "Completed", icon: <CheckCircle2 className="h-3 w-3" /> },
  { value: "incomplete", label: "Incomplete", icon: <Circle className="h-3 w-3" /> },
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
          variant="outline"
          size="sm"
          className={cn("h-7 px-2 text-xs", className)}
        >
          <Filter className="mr-1 h-3 w-3" />
          {currentOption?.label || "Filter"}
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
                "flex items-center justify-between gap-2 rounded px-2 py-1.5 text-xs hover:bg-accent",
                currentFilter === value && "bg-accent"
              )}
            >
              <span>{label}</span>
              {icon}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
