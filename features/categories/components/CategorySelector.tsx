"use client"

import { useCategories } from "../hooks/useCategories"
import type { Category } from "@/types"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox"
import CreateCategoryPopover from "./CreateCategoryPopover"
import { cn } from "@/lib/utils"

interface CategorySelectorProps {
  selectedCategories: Category[]
  onCategoriesChange: (categories: Category[]) => void
  className?: string
  disabled?: boolean
}

export default function CategorySelector({
  selectedCategories,
  onCategoriesChange,
  className,
  disabled = false,
}: CategorySelectorProps) {
  const {
    categories,
    isLoading,
    error,
    createCategory,
    isCreating,
    createError,
  } = useCategories()

  const selectedCategoryIds = selectedCategories.map((c) => c.id)

  const handleCategoryCreated = (newCategory: Category) => {
    // Automatically select the newly created category
    onCategoriesChange([...selectedCategories, newCategory])
  }

  const handleError = (errorMessage: string) => {
    // Error is handled by React Query state
    console.error("Category creation error:", errorMessage)
  }

  const handleCategoryDeleted = (categoryId: string) => {
    // Remove the deleted category from selected categories
    const updatedCategories = selectedCategories.filter(
      (category) => category.id !== categoryId
    )
    onCategoriesChange(updatedCategories)
  }

  if (error || createError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : createError instanceof Error
          ? createError.message
          : "Failed to load categories"
    return (
      <div className={cn("flex flex-row items-center gap-1", className)}>
        <div className="w-full">
          <div className="flex h-10 w-full items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 px-3">
            <span className="text-sm text-destructive">{errorMessage}</span>
          </div>
        </div>
        <div className="w-fit">
          <Button variant="outline" size="icon" disabled>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-row items-center gap-1", className)}>
      <div className="w-full">
        <Combobox
          items={categories}
          multiple
          value={selectedCategoryIds}
          onValueChange={(value) => {
            const selected = categories.filter((category) =>
              value.includes(category.id)
            )
            onCategoriesChange(selected)
          }}
        >
          <ComboboxChips>
            <ComboboxValue>
              {selectedCategories.map((category) => (
                <ComboboxChip key={category.id}>
                  <div className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </ComboboxChip>
              ))}
            </ComboboxValue>
            <ComboboxChipsInput
              placeholder={isLoading ? "Loading..." : "Select categories..."}
              disabled={disabled}
            />
          </ComboboxChips>
          <ComboboxContent>
            <ComboboxEmpty>No categories found.</ComboboxEmpty>
            <ComboboxList>
              {categories.map((category) => (
                <ComboboxItem key={category.id} value={category.id}>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <div className="w-fit">
        <CreateCategoryPopover
          onCategoryCreated={handleCategoryCreated}
          onError={handleError}
          createCategory={createCategory}
          isCreating={isCreating}
          onCategoryDeleted={handleCategoryDeleted}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
