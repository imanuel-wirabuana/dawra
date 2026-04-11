import { Button } from "@/components/ui/button"
import { Edit2, X, Save, Loader2 } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { BucketList, Category } from "@/types"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUpdateBucketList } from "../hooks/useUpdateBucketList"
import CategorySelector from "../../categories/components/CategorySelector"

interface UpdateBucketListItemButtonProps {
  itemId: string | undefined
  item: Partial<BucketList>
  className?: string
}

export default function UpdateBucketListItemButton({
  itemId,
  item,
  className,
}: UpdateBucketListItemButtonProps) {
  const [title, setTitle] = useState(item.title || "")
  const [description, setDescription] = useState(item.description || "")
  const [location, setLocation] = useState(item.location || "")
  const [cost, setCost] = useState(item.cost?.toString() || "")
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    item.categories || []
  )
  const [open, setOpen] = useState(false)
  const updateMutation = useUpdateBucketList()

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (itemId && title.trim() && description.trim()) {
      updateMutation.mutate({
        id: itemId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || undefined,
        cost: cost.trim() ? parseFloat(cost.trim()) : undefined,
        categories: selectedCategories,
      })
      setOpen(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset to original values when closing
      setTitle(item.title || "")
      setDescription(item.description || "")
      setLocation(item.location || "")
      setCost(item.cost?.toString() || "")
      setSelectedCategories(item.categories || [])
    }
    setOpen(newOpen)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={!itemId}
          className={`h-6 w-6 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="text-sm font-medium">Edit Item</div>
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Title"
              className="h-8 text-xs"
              disabled={updateMutation.isPending}
            />
            <Textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Description"
              className="min-h-20 resize-none text-xs"
              disabled={updateMutation.isPending}
            />
            <Input
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
              placeholder="Location (Optional)"
              className="h-8 text-xs"
              disabled={updateMutation.isPending}
            />
            <Input
              value={cost}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCost(e.target.value)
              }
              placeholder="Cost in IDR (Optional)"
              type="number"
              step="0.01"
              min="0"
              className="h-8 text-xs"
              disabled={updateMutation.isPending}
            />
            <CategorySelector
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              disabled={updateMutation.isPending}
            >
              <X className="mr-1 h-3 w-3" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={
                updateMutation.isPending || !title.trim() || !description.trim()
              }
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-1 h-3 w-3" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
