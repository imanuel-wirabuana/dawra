"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Save } from "lucide-react"
import CategorySelector from "@/features/categories/components/CategorySelector"
import type { Category } from "@/types"

// Generate time options in 15-min intervals
const generateTimeOptions = (): string[] => {
  const options: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      options.push(time)
    }
  }
  return options
}

const TIME_OPTIONS = generateTimeOptions()

// Convert time string (HH:MM) to minutes
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

// Get valid end time options based on start time
const getValidEndTimes = (startTime: string): string[] => {
  if (!startTime) return TIME_OPTIONS
  const startMinutes = timeToMinutes(startTime)
  return TIME_OPTIONS.filter((time) => timeToMinutes(time) > startMinutes)
}

interface EditingItem {
  id: string
  itemType: "bucket-list" | "custom"
  title: string
  location?: string
  cost?: number
  description?: string
  categories?: Category[]
  start: string
  end: string
}

interface EditItineraryItemSheetProps {
  item: EditingItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (item: EditingItem) => void
  isPending: boolean
}

export default function EditItineraryItemSheet({
  item,
  open,
  onOpenChange,
  onUpdate,
  isPending,
}: EditItineraryItemSheetProps) {
  const [editedItem, setEditedItem] = useState<EditingItem | null>(item)

  // Sync with parent state when item changes
  useEffect(() => {
    setEditedItem(item)
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedItem) return
    onUpdate(editedItem)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const isBucketList = editedItem?.itemType === "bucket-list"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md h-[90vh] flex flex-col overflow-hidden">
        <SheetHeader className="px-1 pb-4">
          <SheetTitle>Edit Itinerary Item</SheetTitle>
        </SheetHeader>

        {editedItem && (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto px-1 py-2 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  value={editedItem.title}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      title: e.target.value,
                    })
                  }
                  disabled={isBucketList}
                />
                {isBucketList && (
                  <p className="text-xs text-muted-foreground">
                    Title cannot be edited for bucket list items
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="editLocation">Location</Label>
                <Input
                  id="editLocation"
                  value={editedItem.location || ""}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      location: e.target.value,
                    })
                  }
                  disabled={isBucketList}
                />
              </div>

              {/* Cost */}
              <div className="space-y-2">
                <Label htmlFor="editCost">Cost (Rp)</Label>
                <Input
                  id="editCost"
                  type="number"
                  value={editedItem.cost || ""}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      cost: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  disabled={isBucketList}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Input
                  id="editDescription"
                  value={editedItem.description || ""}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      description: e.target.value,
                    })
                  }
                  disabled={isBucketList}
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label htmlFor="editCategories">Categories</Label>
                <CategorySelector
                  selectedCategories={editedItem.categories || []}
                  onCategoriesChange={(categories) =>
                    setEditedItem({
                      ...editedItem,
                      categories,
                    })
                  }
                  disabled={isBucketList}
                />
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStart">Start Time</Label>
                  <Select
                    value={editedItem.start}
                    onValueChange={(value) => {
                      setEditedItem({ ...editedItem, start: value })
                      // Reset end time if it's now invalid
                      if (
                        editedItem.end &&
                        timeToMinutes(editedItem.end) <= timeToMinutes(value)
                      ) {
                        setEditedItem((prev) =>
                          prev ? { ...prev, end: "" } : null
                        )
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIME_OPTIONS.map((time: string) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEnd">End Time</Label>
                  <Select
                    value={editedItem.end}
                    onValueChange={(value) =>
                      setEditedItem({ ...editedItem, end: value })
                    }
                    disabled={!editedItem.start}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          editedItem.start
                            ? "Select end time..."
                            : "Select start first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {getValidEndTimes(editedItem.start).map(
                        (time: string) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 pb-2 border-t mt-auto px-1 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-1 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
