"use client"

import { useState } from "react"
import type { Category } from "@/types"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCategories } from "../hooks/useCategories"

interface CreateCategoryPopoverProps {
  onCategoryCreated: (category: Category) => void
  onError: (error: string) => void
  createCategory: (category: Omit<Category, "id">) => void
  isCreating: boolean
  trigger?: React.ReactNode
  onCategoryDeleted?: (categoryId: string) => void
  disabled?: boolean
}

export default function CreateCategoryPopover({
  onCategoryCreated,
  onError,
  createCategory,
  isCreating,
  trigger,
  onCategoryDeleted,
  disabled = false,
}: CreateCategoryPopoverProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState("#a21caf")

  // Tailwind color presets
  const colorPresets = [
    { name: "Red", value: "#ef4444", bg: "bg-red-500" },
    { name: "Orange", value: "#f97316", bg: "bg-orange-500" },
    { name: "Amber", value: "#f59e0b", bg: "bg-amber-500" },
    { name: "Green", value: "#22c55e", bg: "bg-green-500" },
    { name: "Blue", value: "#3b82f6", bg: "bg-blue-500" },
    { name: "Purple", value: "#a855f7", bg: "bg-purple-500" },
    { name: "Indigo", value: "#6366f1", bg: "bg-indigo-500" },
    { name: "Teal", value: "#14b8a6", bg: "bg-teal-500" },
  ]

  const { categories, deleteCategory, isDeleting, createCategoryMutation } =
    useCategories()

  const handleCreate = () => {
    if (!name.trim()) return

    // Create the category object that will be passed to the callback
    const newCategory: Omit<Category, "id"> = {
      name: name.trim(),
      color: color,
    }

    // Use the mutation with success callback
    createCategoryMutation.mutate(newCategory, {
      onSuccess: (data: { success: boolean; id?: string }) => {
        // Call the callback with the newly created category (with real ID from API)
        if (data.success && data.id) {
          onCategoryCreated({
            ...newCategory,
            id: data.id,
          })
        }
      },
    })

    // Reset form and close
    setName("")
    setColor("#A855F7")
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
    setName("")
    setColor("#A855F7")
  }

  const handleDelete = (categoryId: string) => {
    deleteCategory(categoryId)

    // Call the callback to unselect the category if it's currently selected
    if (onCategoryDeleted) {
      onCategoryDeleted(categoryId)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" size="icon" disabled={disabled}>
      <Plus className="h-4 w-4" />
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent className="w-72" align="center">
        <div className="space-y-3">
          {/* Create New Category Section */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name" className="text-xs">
              Category Name
            </Label>
            <Input
              id="category-name"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              className="h-8"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category-color" className="text-xs">
              Color
            </Label>
            {/* Color Presets */}
            <div className="grid grid-cols-4 gap-1.5">
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  disabled={isCreating}
                  className={`h-8 w-full rounded-md ${preset.bg} flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 ${
                    color.toLowerCase() === preset.value.toLowerCase()
                      ? "ring-2 ring-offset-1 ring-foreground"
                      : ""
                  }`}
                  title={preset.name}
                >
                  {color.toLowerCase() === preset.value.toLowerCase() && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="category-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isCreating}
                className="h-8 w-12 p-1"
              />
              <Input
                placeholder="#a21caf"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isCreating}
                className="h-8 flex-1"
              />
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
              className="h-8 flex-1 text-xs"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-1 h-3 w-3" />
                  Create
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isCreating}
              className="h-8 px-2 text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              Cancel
            </Button>
          </div>

          {/* Existing Categories Section */}
          {categories.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs">Existing Categories</Label>
              <ScrollArea className="h-36 w-full rounded-md border">
                <div className="space-y-0.5 p-1.5">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between gap-1.5 rounded p-1 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs">{category.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting}
                        className="h-5 w-5 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
