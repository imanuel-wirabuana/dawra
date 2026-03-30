"use client"

import { useState } from "react"
import { useAddBucketList } from "../hooks/useAddBucketList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import CategorySelector from "@/features/categories/components/CategorySelector"
import type { Category } from "@/types"

interface BucketListFormProps {
  className?: string
}

export default function BucketListForm({ className }: BucketListFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [cost, setCost] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const addBucketListMutation = useAddBucketList()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      return
    }

    addBucketListMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      location: location.trim() || undefined,
      cost: cost.trim() ? parseFloat(cost.trim()) : undefined,
      completed: false,
      categories: selectedCategories,
    })
  }

  // Reset form on successful submission
  if (addBucketListMutation.isSuccess) {
    setTitle("")
    setDescription("")
    setLocation("")
    setCost("")
    setSelectedCategories([])
    addBucketListMutation.reset()
  }

  return (
    <Card className={cn("mb-6", className)}>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Enter title..."
              disabled={addBucketListMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Enter description..."
              disabled={addBucketListMutation.isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
              placeholder="Enter location..."
              disabled={addBucketListMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost (Optional)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCost(e.target.value)
              }
              placeholder="Enter cost in IDR..."
              disabled={addBucketListMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Categories</Label>
            <CategorySelector
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
          </div>

          {addBucketListMutation.error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {addBucketListMutation.error.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={addBucketListMutation.isPending}
            className="w-full"
          >
            {addBucketListMutation.isPending ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
