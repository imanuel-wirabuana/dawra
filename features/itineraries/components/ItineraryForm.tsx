"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Inbox, Loader2, Plus, Sparkles } from "lucide-react"

import type { Category } from "@/types"
import { cn } from "@/lib/utils"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useItineraryStore } from "@/store/itineraryStore"
import CategorySelector from "@/features/categories/components/CategorySelector"

import { useAddItineraryItem } from "../hooks/useAddItineraryItem"
import { useGetBucketListItems } from "../hooks/useGetBucketListItems"

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
  const [itemType, setItemType] = useState<ItemType>("custom")

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
      {/* Item Type Selection */}
      <div className="rounded-lg border border-border/50 bg-linear-to-b from-muted/30 to-muted/10 p-1">
        <Tabs
          value={itemType}
          onValueChange={(v: string) => setItemType(v as ItemType)}
          className="w-full"
        >
          <TabsList className="grid h-9 w-full grid-cols-2 bg-linear-to-b from-muted/60 to-muted/30 p-1">
            <TabsTrigger
              value="custom"
              className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Custom
            </TabsTrigger>
            <TabsTrigger
              value="bucket-list"
              className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Bucket List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bucket-list" className="mt-3 space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="bucketList"
                className="flex items-center gap-1.5 text-xs font-medium"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                Select Bucket List Item
              </Label>
              <Select
                value={selectedBucketListId}
                onValueChange={setSelectedBucketListId}
                disabled={addItineraryMutation.isPending}
              >
                <SelectTrigger className="h-10 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Choose an item from your bucket list..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {bucketListItems.filter((item) => !item.completed).length ===
                  0 ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <Inbox className="mb-2 h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No bucket list items
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Add items in the Bucket Lists section
                      </p>
                    </div>
                  ) : (
                    bucketListItems
                      .filter((item) => !item.completed)
                      .map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id!}
                          className="py-2"
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{item.title}</span>
                            {item.location && (
                              <span className="text-xs text-muted-foreground">
                                {item.location}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
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
      </div>

      {/* Time Section */}
      <div className="space-y-3 rounded-lg border border-border/50 bg-linear-to-b from-muted/40 to-muted/15 p-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Schedule Time
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="startTime" className="text-xs font-medium">
              Start Time
            </Label>
            <Select
              value={startTime}
              onValueChange={(value) => {
                setStartTime(value)
                if (endTime && timeToMinutes(endTime) <= timeToMinutes(value)) {
                  setEndTime("")
                }
              }}
              disabled={addItineraryMutation.isPending}
            >
              <SelectTrigger className="h-10 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20">
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
              <SelectTrigger
                className={cn(
                  "h-10 border-input/60 bg-background text-sm transition-all duration-150",
                  !startTime && "text-muted-foreground/50"
                )}
              >
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
      </div>

      {addItineraryMutation.error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
          <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
          {addItineraryMutation.error.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitDisabled()}
        className="h-10 w-full bg-primary font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {addItineraryMutation.isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add to Itinerary
          </span>
        )}
      </Button>
    </form>
  )
}
