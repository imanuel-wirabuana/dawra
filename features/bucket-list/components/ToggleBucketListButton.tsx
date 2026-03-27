import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useToggleBucketList } from "../hooks/useToggleBucketList"

interface ToggleBucketListButtonProps {
  itemId: string | undefined
  completed: boolean | undefined
  className?: string
}

export default function ToggleBucketListButton({
  itemId,
  completed,
  className,
}: ToggleBucketListButtonProps) {
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
      className={`h-4 w-4 rounded-full border-2 border-primary ${completed ? "bg-primary hover:bg-primary/90" : ""} ${className}`}
    >
      {completed && <Check className="h-2 w-2" />}
    </Button>
  )
}
