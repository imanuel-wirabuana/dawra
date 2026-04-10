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
        <TabsList className="grid h-9 w-full grid-cols-2 bg-muted/50 p-1">
          <TabsTrigger
            value="bucket-list"
            className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Bucket List
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bucket-list" className="mt-3 space-y-2">
          <Label htmlFor="bucketList" className="text-xs font-medium">
            Select Bucket List Item
          </Label>
          <Select
            value={selectedBucketListId}
            onValueChange={setSelectedBucketListId}
            disabled={addItineraryMutation.isPending}
          >
            <SelectTrigger className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20">
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

        <TabsContent value="custom" className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="customTitle" className="text-xs font-medium">
              Title *
            </Label>
            <Input
              id="customTitle"
              placeholder="e.g., Lunch break, Travel time"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              disabled={addItineraryMutation.isPending}
              className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="customLocation"
                className="text-xs font-medium text-muted-foreground"
              >
                Location
              </Label>
              <Input
                id="customLocation"
                placeholder="e.g., Cafe Central"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                disabled={addItineraryMutation.isPending}
                className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="customCost"
                className="text-xs font-medium text-muted-foreground"
              >
                Cost (IDR)
              </Label>
              <Input
                id="customCost"
                type="number"
                placeholder="0"
                value={customCost}
                onChange={(e) => setCustomCost(e.target.value)}
                disabled={addItineraryMutation.isPending}
                className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="customDescription"
              className="text-xs font-medium text-muted-foreground"
            >
              Description
            </Label>
            <Input
              id="customDescription"
              placeholder="Notes, booking ref, etc."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              disabled={addItineraryMutation.isPending}
              className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Categories
            </Label>
            <CategorySelector
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Time fields (always shown) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="startTime" className="text-xs font-medium">
            Start Time
          </Label>
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
            <SelectTrigger className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select..." />
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
        <div className="space-y-1.5">
          <Label htmlFor="endTime" className="text-xs font-medium">
            End Time
          </Label>
          <Select
            value={endTime}
            onValueChange={setEndTime}
            disabled={addItineraryMutation.isPending || !startTime}
          >
            <SelectTrigger className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue
                placeholder={startTime ? "Select..." : "Start first"}
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
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {addItineraryMutation.error.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitDisabled()}
        className="h-9 w-full bg-primary font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
      >
        {addItineraryMutation.isPending ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Adding...
          </span>
        ) : (
          "Add to Itinerary"
        )}
      </Button>
    </form>
  )
}
