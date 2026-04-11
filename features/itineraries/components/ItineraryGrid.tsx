"use client"

import { useState } from "react"
import { useRealtimeItineraryItems } from "../hooks/useRealtimeItineraryItems"
import { useGetBucketListItems } from "../hooks/useGetBucketListItems"
import { useUpdateItineraryItem } from "../hooks/useUpdateItineraryItem"
import { useAddItineraryItem } from "../hooks/useAddItineraryItem"
import GridTimeline from "@/features/itineraries/components/GridTimeline"
import DatePicker from "./DatePicker"
import ItineraryForm from "./ItineraryForm"
import { Plus, X, Save, CalendarDays, Wallet, ListTodo } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const bucketListItems = useGetBucketListItems()
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

  // Add popover state for ItineraryForm
  const [formOpen, setFormOpen] = useState(false)

  // Drawer state for slot click
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [slotStartTime, setSlotStartTime] = useState("")
  const [slotEndTime, setSlotEndTime] = useState("")
  const [slotDate, setSlotDate] = useState<Date | null>(null)

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

  // Slot click handler - opens drawer with pre-populated time
  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    // Default end time is 1 hour later (or next available slot)
    let endHour = hour + 1
    let endMinute = minute
    if (endHour >= 24) {
      endHour = 23
      endMinute = 45
    }
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`

    setSlotStartTime(startTime)
    setSlotEndTime(endTime)
    setSlotDate(date)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSlotStartTime("")
    setSlotEndTime("")
    setSlotDate(null)
  }

  // Transform ItineraryItem to the format expected by GridTimeline
  const transformedItems =
    itineraryItems.map((item: ItineraryItem) => {
      // For bucket-list items, resolve the linked bucket list by id
      // For custom items, use customItem data
      const bucketListItem =
        item.itemType === "bucket-list"
          ? bucketListItems.find(
              (bucketList) => bucketList.id === item.bucketList
            )
          : undefined
      const itemData =
        item.itemType === "bucket-list" ? bucketListItem : item.customItem

      return {
        ...(itemData || {}),
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
        ? bucketListItems.find(
            (bucketList) => bucketList.id === item.bucketList
          )?.cost
        : item.customItem?.cost
    return sum + (cost || 0)
  }, 0)

  return (
    <>
      <Card className="overflow-hidden border-border/60 shadow-lg shadow-black/5">
        <CardHeader className="border-b border-border/50 bg-gradient-to-b from-muted/50 to-muted/20 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              
              <Popover open={formOpen} onOpenChange={setFormOpen}>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    className="h-9 gap-1.5 bg-primary px-4 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 shadow-lg" align="end">
                  <div className="border-b border-border/50 bg-gradient-to-b from-muted/50 to-muted/20 px-4 py-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Add New Item
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Schedule a new activity to your itinerary
                    </p>
                  </div>
                  <div className="p-4">
                    <ItineraryForm onSuccess={() => setFormOpen(false)} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full">
                <ListTodo className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {transformedItems.length}{" "}
                  {transformedItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              {totalCost > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:from-emerald-900/30 dark:to-emerald-900/20 dark:text-emerald-400 shadow-sm">
                  <Wallet className="h-3.5 w-3.5" />
                  Rp {totalCost.toLocaleString("id-ID")}
                </div>
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
            onSlotClick={handleSlotClick}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </CardContent>
      </Card>

      {/* Edit Sheet for Custom Items */}
      <Sheet
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Itinerary Item</SheetTitle>
          </SheetHeader>
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
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1"
                >
                  {updateMutation.isPending ? (
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

      {/* Create Sheet for Slot Click */}
      <Sheet
        open={isDrawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleDrawerClose()
          }
          setIsDrawerOpen(open)
        }}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Itinerary Item</SheetTitle>
          </SheetHeader>
          <div className="flex justify-center px-4 pt-4 pb-4">
            <ItineraryForm
              className="mx-auto w-full"
              initialStartTime={slotStartTime}
              initialEndTime={slotEndTime}
              initialDate={slotDate}
              onSuccess={handleDrawerClose}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
