"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useAddItineraryItem } from "../hooks/useAddItineraryItem"
import { useGetBucketListItems } from "../hooks/useGetBucketListItems"
import { useItineraryStore } from "@/store/itineraryStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Category } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CategorySelector from "@/features/categories/components/CategorySelector"
import { cn } from "@/lib/utils"

interface ItineraryFormProps {
  onSuccess?: () => void
  initialStartTime?: string
  initialEndTime?: string
  initialDate?: Date | null
  className?: string
}

type ItemType = "bucket-list" | "custom"

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

export default function ItineraryForm({
  onSuccess,
  initialStartTime = "",
  initialEndTime = "",
  initialDate,
  className,
}: ItineraryFormProps) {
  const [itemType, setItemType] = useState<ItemType>("bucket-list")

  // Data hooks - must be before any derived state
  const { selectedDate: storeSelectedDate } = useItineraryStore()
  const selectedDate = initialDate || storeSelectedDate
  const addItineraryMutation = useAddItineraryItem()
  const bucketListItems = useGetBucketListItems()

  // Bucket list mode state
  const [selectedBucketListId, setSelectedBucketListId] = useState<string>("")

  // Custom item mode state
  const [customTitle, setCustomTitle] = useState("")
  const [customLocation, setCustomLocation] = useState("")
  const [customCost, setCustomCost] = useState("")
  const [customDescription, setCustomDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

  // Shared state - initialize with provided values
  const [startTime, setStartTime] = useState(initialStartTime)
  const [endTime, setEndTime] = useState(initialEndTime)

  // Format selected date for input fields
  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd")
  }

  const resetForm = () => {
    setSelectedBucketListId("")
    setCustomTitle("")
    setCustomLocation("")
    setCustomCost("")
    setCustomDescription("")
    setSelectedCategories([])
    setStartTime("")
    setEndTime("")
    setItemType("bucket-list")
  }

  const isSubmitDisabled = () => {
    if (!startTime || !endTime) return true
    if (itemType === "bucket-list" && !selectedBucketListId) return true
    if (itemType === "custom" && !customTitle.trim()) return true
    return addItineraryMutation.isPending
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startTime || !endTime) {
      return
    }

    const baseItem = {
      date: formatDateForInput(selectedDate),
      start: startTime,
      end: endTime,
    }

    if (itemType === "bucket-list") {
      if (!selectedBucketListId) return

      addItineraryMutation.mutate({
        ...baseItem,
        itemType: "bucket-list",
        completed: false,
        bucketList: selectedBucketListId,
      })
    } else {
      if (!customTitle.trim()) return

      addItineraryMutation.mutate({
        ...baseItem,
        itemType: "custom",
        completed: false,
        customItem: {
          title: customTitle.trim(),
          location: customLocation.trim() || undefined,
          cost: customCost ? Number(customCost) : undefined,
          description: customDescription.trim() || undefined,
          categories: selectedCategories,
        },
      })
    }
  }

  // Reset form on successful submission
  useEffect(() => {
    if (addItineraryMutation.isSuccess) {
      resetForm()
      onSuccess?.()
      addItineraryMutation.reset()
    }
  }, [addItineraryMutation.isSuccess])

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <Tabs
        value={itemType}
        onValueChange={(v: string) => setItemType(v as ItemType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bucket-list">Bucket List</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="bucket-list" className="mt-4 space-y-2">
          <Label htmlFor="bucketList">Select Bucket List Item</Label>
          <Select
            value={selectedBucketListId}
            onValueChange={setSelectedBucketListId}
            disabled={addItineraryMutation.isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an item..." />
            </SelectTrigger>
            <SelectContent>
              {bucketListItems
                .filter((item) => !item.completed)
                .map((item) => (
                  <SelectItem key={item.id} value={item.id!}>
                    {item.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </TabsContent>

        <TabsContent value="custom" className="mt-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="customTitle">Title *</Label>
            <Input
              id="customTitle"
              placeholder="e.g., Lunch break, Travel time"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              disabled={addItineraryMutation.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="customLocation">Location (optional)</Label>
              <Input
                id="customLocation"
                placeholder="e.g., Cafe Central"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                disabled={addItineraryMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customCost">Cost (optional)</Label>
              <Input
                id="customCost"
                type="number"
                placeholder="0"
                value={customCost}
                onChange={(e) => setCustomCost(e.target.value)}
                disabled={addItineraryMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customDescription">Description (optional)</Label>
            <Input
              id="customDescription"
              placeholder="Notes, booking ref, etc."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              disabled={addItineraryMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Categories</Label>
            <CategorySelector
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Time fields (always shown) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Select
            value={startTime}
            onValueChange={(value) => {
              setStartTime(value)
              // Reset end time if it's now invalid
              if (endTime && timeToMinutes(endTime) <= timeToMinutes(value)) {
                setEndTime("")
              }
            }}
            disabled={addItineraryMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {TIME_OPTIONS.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Select
            value={endTime}
            onValueChange={setEndTime}
            disabled={addItineraryMutation.isPending || !startTime}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  startTime ? "Select end time..." : "Select start first"
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {getValidEndTimes(startTime).map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {addItineraryMutation.error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {addItineraryMutation.error.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitDisabled()} className="w-full">
        {addItineraryMutation.isPending ? "Adding..." : "Add Item"}
      </Button>
    </form>
  )
}
