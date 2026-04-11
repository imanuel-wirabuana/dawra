"use client"

import { useState } from "react"
import { useAddBucketList } from "../hooks/useAddBucketList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2, Plus } from "lucide-react"
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
    <Card
      className={cn(
        "overflow-hidden border-border/50 shadow-sm transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      <CardHeader className="space-y-1 border-b bg-muted/30 px-5 py-4">
        <CardTitle className="text-base font-semibold">Add New Item</CardTitle>
        <p className="text-xs text-muted-foreground">
          Create a new bucket list goal
        </p>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-xs font-medium text-foreground"
            >
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="What do you want to achieve?"
              disabled={addBucketListMutation.isPending}
              className="h-10 border-input/60 bg-background transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-medium text-foreground"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Add some details about this goal..."
              disabled={addBucketListMutation.isPending}
              rows={3}
              className="resize-none border-input/60 bg-background transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Optional Fields Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-xs font-medium text-muted-foreground"
              >
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value)
                }
                placeholder="Where?"
                disabled={addBucketListMutation.isPending}
                className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cost"
                className="text-xs font-medium text-muted-foreground"
              >
                Cost (IDR)
              </Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={cost}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCost(e.target.value)
                }
                placeholder="How much?"
                disabled={addBucketListMutation.isPending}
                className="h-9 border-input/60 bg-background text-sm transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Categories
            </Label>
            <CategorySelector
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
          </div>

          {/* Error Message */}
          {addBucketListMutation.error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
              {addBucketListMutation.error.message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={addBucketListMutation.isPending || !title.trim()}
            className="h-10 w-full bg-primary font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            {addBucketListMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add to Bucket List
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
