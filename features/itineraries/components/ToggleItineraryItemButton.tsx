import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useToggleItineraryItem } from "../hooks/useToggleItineraryItem"

interface ToggleItineraryItemButtonProps {
  itemId: string | undefined
  completed: boolean | undefined
  className?: string
}

export default function ToggleItineraryItemButton({
  itemId,
  completed,
  className,
}: ToggleItineraryItemButtonProps) {
  const toggleMutation = useToggleItineraryItem()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (itemId) {
      toggleMutation.mutate({ id: itemId, completed: !completed })
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={toggleMutation.isPending || !itemId}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 ease-out",
        "h-5 w-5 min-h-[20px] min-w-[20px]",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
        "hover:scale-110 active:scale-95",
        completed
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-muted-foreground/40 bg-transparent text-muted-foreground/40 hover:border-primary/60 hover:text-primary/60",
        toggleMutation.isPending && "opacity-50 cursor-wait",
        className
      )}
      title={completed ? "Mark as incomplete" : "Mark as complete"}
      aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
    >
      {completed && (
        <Check className="h-3 w-3 stroke-[3] transition-transform duration-200 ease-out" />
      )}
    </button>
  )
}
