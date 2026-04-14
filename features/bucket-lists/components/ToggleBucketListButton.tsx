import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
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
      className={cn(
        "h-5 w-5 rounded-full border-2 transition-all duration-200",
        completed
          ? "border-primary bg-primary hover:scale-110 hover:bg-primary/90"
          : "border-primary/50 bg-transparent hover:border-primary hover:bg-primary/10",
        className
      )}
    >
      {completed && <Check className="h-3 w-3" />}
    </Button>
  )
}
