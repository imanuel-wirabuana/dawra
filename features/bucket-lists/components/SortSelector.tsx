"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown, CheckCircle, Circle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { SortOption } from "@/types"

interface SortOptionConfig {
  value: SortOption
  label: string
  icon: LucideIcon
}

const sortOptions: SortOptionConfig[] = [
  { value: "title-asc", label: "Title (A-Z)", icon: ArrowUp },
  { value: "title-desc", label: "Title (Z-A)", icon: ArrowDown },
  { value: "created-asc", label: "Created (Oldest)", icon: ArrowUp },
  { value: "created-desc", label: "Created (Newest)", icon: ArrowDown },
  { value: "cost-asc", label: "Cost (Low to High)", icon: ArrowUp },
  { value: "cost-desc", label: "Cost (High to Low)", icon: ArrowDown },
  { value: "completed", label: "Completed First", icon: CheckCircle },
  { value: "incomplete", label: "Incomplete First", icon: Circle },
]

interface SortSelectorProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
  className?: string
}

export default function SortSelector({
  currentSort,
  onSortChange,
  className,
}: SortSelectorProps) {
  const [open, setOpen] = useState(false)

  const currentOption = sortOptions.find(
    (option) => option.value === currentSort
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
          <ArrowUpDown className="h-3 w-3" />
          <span className="hidden sm:inline">Sort</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="flex flex-col">
          {sortOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                onSortChange(value)
                setOpen(false)
              }}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-150",
                currentSort === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span>{label}</span>
              <Icon
                className={cn(
                  "h-3 w-3",
                  currentSort === value
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
