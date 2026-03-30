"use client"

import { useState } from "react"
import type { Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import CategorySelector from "./CategorySelector"

interface CategoryFilterSelectorProps {
  selectedCategories: Category[]
  onCategoriesChange: (categories: Category[]) => void
  className?: string
}

export default function CategoryFilterSelector({
  selectedCategories,
  onCategoriesChange,
  className,
}: CategoryFilterSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleClearFilters = () => {
    onCategoriesChange([])
    setOpen(false)
  }

  const hasFilters = selectedCategories.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasFilters ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-7 px-2 text-xs",
            hasFilters && "bg-primary text-primary-foreground",
            className
          )}
        >
          <Filter className="mr-1 h-3 w-3" />
          {hasFilters ? (
            <>
              Filter ({selectedCategories.length})
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearFilters()
                }}
              />
            </>
          ) : (
            "Filter"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Filter by Categories</div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          <CategorySelector
            selectedCategories={selectedCategories}
            onCategoriesChange={onCategoriesChange}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
