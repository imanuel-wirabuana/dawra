import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useToggleBucketList } from "../hooks/useToggleBucketList"

interface ToggleBucketListItemButtonProps {
  itemId: string | undefined
  completed: boolean | undefined
  className?: string
}

export default function ToggleBucketListItemButton({
  itemId,
  completed,
  className,
}: ToggleBucketListItemButtonProps) {
  const toggleMutation = useToggleBucketList()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (itemId) {
      toggleMutation.mutate({ id: itemId, completed: !completed })
    }
  }

  return (
    <Button
      variant={completed ? "default" : "outline"}
      size="icon"
      onClick={handleToggle}
      disabled={toggleMutation.isPending || !itemId}
      className={`h-6 w-6 ${completed ? "bg-primary hover:bg-primary/90" : ""} ${className}`}
    >
      <Check className="h-3 w-3" />
    </Button>
  )
}
