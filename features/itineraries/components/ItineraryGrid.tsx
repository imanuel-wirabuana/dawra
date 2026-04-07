"use client"

import { useState } from "react"
import { useRealtimeItineraryItems } from "../hooks/useRealtimeItineraryItems"
import { useUpdateItineraryItem } from "../hooks/useUpdateItineraryItem"
import GridTimeline from "@/features/itineraries/components/GridTimeline"
import DatePicker from "./DatePicker"
import ItineraryForm from "./ItineraryForm"
import { deleteItineraryItem } from "../services/delete.service"
import type { ItineraryItem, Category } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useItineraryStore } from "@/store/itineraryStore"
import { isSameDay, parseISO, format } from "date-fns"
import CategorySelector from "@/features/categories/components/CategorySelector"

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

export default function ItineraryGrid() {
  const itineraryItems = useRealtimeItineraryItems()
  const updateMutation = useUpdateItineraryItem()
  const { selectedDate, setSelectedDate } = useItineraryStore()
  const [editingItem, setEditingItem] = useState<{
    id: string
    itemType: "bucket-list" | "custom"
    title: string
    location?: string
    cost?: number
    description?: string
    categories?: Category[]
    start: string
    end: string
  } | null>(null)

  const handleDelete = async (id: string) => {
    await deleteItineraryItem(id)
  }

  const handleReschedule = async (
    id: string,
    newStartTime: string,
    newEndTime: string,
    targetDate?: Date
  ) => {
    // Use format to get yyyy-MM-dd in local timezone, avoiding UTC conversion issues
    const formatDateForInput = (date: Date) => format(date, "yyyy-MM-dd")
    const dateToUse = targetDate || selectedDate

    await updateMutation.mutateAsync({
      id,
      updates: {
        date: formatDateForInput(dateToUse),
        start: newStartTime,
        end: newEndTime,
      },
    })
  }

  const handleEdit = (item: {
    id: string
    itemType: "bucket-list" | "custom"
    title: string
    location?: string
    cost?: number
    description?: string
    categories?: Category[]
    start: string
    end: string
  }) => {
    setEditingItem(item)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    // Parse the time from the full ISO string if needed
    const parseTime = (timeStr: string) => {
      // If timeStr is already just time (HH:mm), return it
      if (timeStr.length === 5 && timeStr.includes(":")) {
        return timeStr
      }
      // If timeStr includes date portion, extract just time
      const match = timeStr.match(/T(\d{2}:\d{2})/)
      return match ? match[1] : timeStr
    }

    await updateMutation.mutateAsync({
      id: editingItem.id,
      updates: {
        start: parseTime(editingItem.start),
        end: parseTime(editingItem.end),
        ...(editingItem.itemType === "custom" && {
          customItem: {
            title: editingItem.title,
            location: editingItem.location,
            cost: editingItem.cost,
            description: editingItem.description,
            categories: editingItem.categories,
          },
        }),
      },
    })

    setEditingItem(null)
  }

  // Transform ItineraryItem to the format expected by GridTimeline
  const transformedItems =
    itineraryItems.map((item: ItineraryItem) => {
      // For bucket-list items, use bucketList data
      // For custom items, use customItem data
      const itemData =
        item.itemType === "bucket-list" ? item.bucketList : item.customItem

      return {
        ...itemData,
        id: item.id,
        itemType: item.itemType,
        title: itemData?.title || "Untitled",
        location: itemData?.location,
        cost: itemData?.cost,
        description: itemData?.description,
        categories: itemData?.categories,
        completed: item.completed,
        date: item.date ? parseISO(item.date) : new Date(item.start),
        start: item.start?.includes("T")
          ? item.start.split("T")[1]
          : item.start,
        end: item.end?.includes("T") ? item.end.split("T")[1] : item.end,
      }
    }) || []

  // Calculate total daily budget from items with costs for the selected date only
  const totalCost = itineraryItems.reduce((sum, item) => {
    if (!item.date) return sum
    const itemDate = parseISO(item.date)
    if (!isSameDay(itemDate, selectedDate)) return sum

    const cost =
      item.itemType === "bucket-list"
        ? item.bucketList?.cost
        : item.customItem?.cost
    return sum + (cost || 0)
  }, 0)

  return (
    <>
      <Card className="border-0 bg-linear-to-br from-background to-muted/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <DatePicker />
              <ItineraryForm className="w-fit" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal text-muted-foreground">
                {transformedItems.length}{" "}
                {transformedItems.length === 1 ? "item" : "items"}
              </span>
              {totalCost > 0 && (
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  Rp.
                  {totalCost.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <GridTimeline
            items={transformedItems}
            onDeleteItem={handleDelete}
            onEditItem={handleEdit}
            onReschedule={handleReschedule}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog for Custom Items */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent className="sm:max-w-96">
          <DialogHeader>
            <DialogTitle>Edit Itinerary Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      title: e.target.value,
                    })
                  }
                  disabled={editingItem.itemType === "bucket-list"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLocation">Location</Label>
                <Input
                  id="editLocation"
                  value={editingItem.location || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      location: e.target.value,
                    })
                  }
                  disabled={editingItem.itemType === "bucket-list"}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="editCost">Cost</Label>
                  <Input
                    id="editCost"
                    type="number"
                    value={editingItem.cost || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        cost: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    disabled={editingItem.itemType === "bucket-list"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Input
                  id="editDescription"
                  value={editingItem.description || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  disabled={editingItem.itemType === "bucket-list"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCategories">Categories</Label>
                <CategorySelector
                  selectedCategories={editingItem.categories || []}
                  onCategoriesChange={(categories) =>
                    setEditingItem({
                      ...editingItem,
                      categories,
                    })
                  }
                  disabled={editingItem.itemType === "bucket-list"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStart">Start Time</Label>
                  <Select
                    value={editingItem.start}
                    onValueChange={(value) => {
                      setEditingItem({ ...editingItem, start: value })
                      // Reset end time if it's now invalid
                      if (
                        editingItem.end &&
                        timeToMinutes(editingItem.end) <= timeToMinutes(value)
                      ) {
                        setEditingItem((prev) =>
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
                    value={editingItem.end}
                    onValueChange={(value) =>
                      setEditingItem({ ...editingItem, end: value })
                    }
                    disabled={!editingItem.start}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          editingItem.start
                            ? "Select end time..."
                            : "Select start first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {getValidEndTimes(editingItem.start).map(
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

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
