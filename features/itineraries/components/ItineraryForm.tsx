"use client"

import { useState } from "react"
import { useAddItineraryItem } from "../hooks/useAddItineraryItem"
import { useGetBucketListItems } from "../hooks/useGetBucketListItems"
import { useItineraryStore } from "@/store/itineraryStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BucketList } from "@/types"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ItineraryFormProps {
  className?: string
}

type ItemType = "bucket-list" | "custom"

export default function ItineraryForm({ className }: ItineraryFormProps) {
  const [open, setOpen] = useState(false)
  const [itemType, setItemType] = useState<ItemType>("bucket-list")

  // Data hooks - must be before any derived state
  const { selectedDate } = useItineraryStore()
  const addItineraryMutation = useAddItineraryItem()
  const bucketListItems = useGetBucketListItems()

  // Bucket list mode state
  const [selectedBucketListId, setSelectedBucketListId] = useState<string>("")
  const selectedBucketList =
    bucketListItems.find((item) => item.id === selectedBucketListId) || null

  // Custom item mode state
  const [customTitle, setCustomTitle] = useState("")
  const [customLocation, setCustomLocation] = useState("")
  const [customCost, setCustomCost] = useState("")
  const [customDescription, setCustomDescription] = useState("")

  // Shared state
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  // Format selected date for input fields
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0] // YYYY-MM-DD format
  }

  const resetForm = () => {
    setSelectedBucketListId("")
    setCustomTitle("")
    setCustomLocation("")
    setCustomCost("")
    setCustomDescription("")
    setStartTime("")
    setEndTime("")
    setItemType("bucket-list")
  }

  const isSubmitDisabled = () => {
    if (!startTime || !endTime) return true
    if (itemType === "bucket-list" && !selectedBucketList) return true
    if (itemType === "custom" && !customTitle.trim()) return true
    return addItineraryMutation.isPending
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startTime || !endTime) {
      return
    }

    const baseItem = {
      start: `${formatDateForInput(selectedDate)}T${startTime}`,
      end: `${formatDateForInput(selectedDate)}T${endTime}`,
    }

    if (itemType === "bucket-list") {
      if (!selectedBucketList) return

      addItineraryMutation.mutate({
        ...baseItem,
        itemType: "bucket-list",
        completed: false,
        bucketList: selectedBucketList,
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
        },
      })
    }
  }

  // Reset form on successful submission
  if (addItineraryMutation.isSuccess) {
    resetForm()
    setOpen(false)
    addItineraryMutation.reset()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className={cn("mb-6", className)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Itinerary Item
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:max-w-96" align="end">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add New Itinerary Item</h3>
          <Tabs
            value={itemType}
            onValueChange={(v: string) => setItemType(v as ItemType)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bucket-list">Bucket List</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bucket List Mode */}
            {itemType === "bucket-list" && (
              <div className="space-y-2">
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
              </div>
            )}

            {/* Custom Item Mode */}
            {itemType === "custom" && (
              <div className="space-y-3">
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
                  <Label htmlFor="customDescription">
                    Description (optional)
                  </Label>
                  <Input
                    id="customDescription"
                    placeholder="Notes, booking ref, etc."
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    disabled={addItineraryMutation.isPending}
                  />
                </div>
              </div>
            )}

            {/* Time fields (always shown) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={addItineraryMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={addItineraryMutation.isPending}
                />
              </div>
            </div>

            {addItineraryMutation.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {addItineraryMutation.error.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitDisabled()}
              className="w-full"
            >
              {addItineraryMutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  )
}
