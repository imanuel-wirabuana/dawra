"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
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
  icon: any
}

const sortOptions: SortOptionConfig[] = [
  { value: "title-asc", label: "Title (A-Z)", icon: "↑" },
  { value: "title-desc", label: "Title (Z-A)", icon: "↓" },
  { value: "created-asc", label: "Created (Oldest)", icon: "↑" },
  { value: "created-desc", label: "Created (Newest)", icon: "↓" },
  { value: "cost-asc", label: "Cost (Low to High)", icon: "↑" },
  { value: "cost-desc", label: "Cost (High to Low)", icon: "↓" },
  { value: "completed", label: "Completed First", icon: "✓" },
  { value: "incomplete", label: "Incomplete First", icon: "○" },
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
          variant="outline"
          size="sm"
          className={cn("h-7 px-2 text-xs", className)}
        >
          <ArrowUpDown className="mr-1 h-3 w-3" />
          Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="flex flex-col">
          {sortOptions.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => {
                onSortChange(value)
                setOpen(false)
              }}
              className={cn(
                "flex items-center justify-between gap-2 rounded px-2 py-1.5 text-xs hover:bg-accent",
                currentSort === value && "bg-accent"
              )}
            >
              <span>{label}</span>
              <span className="text-muted-foreground">{icon}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
