import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MoreHorizontal } from "lucide-react"

interface TimelineEventProps {
  item: {
    id: string
    title: string
    start: string
    end: string
    location?: string
    cost?: number
    description?: string
  }
  className?: string
  style?: React.CSSProperties
}

export default function TimelineEvent({
  item,
  className,
  style,
}: TimelineEventProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "group flex cursor-pointer flex-col gap-0.5 rounded-md border bg-primary p-2 shadow-sm transition-colors hover:bg-primary/80",
            className
          )}
          style={style}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <h3 className="truncate text-xs font-semibold text-primary-foreground">
                {item.title}
              </h3>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 border-0 text-foreground shadow-lg"
        align="center"
        side="top"
      >
        <div className="space-y-2 px-2 py-1">
          <h4 className="text-sm leading-tight font-semibold">{item.title}</h4>
          <div className="space-y-1 text-xs opacity-90">
            <div className="flex items-center gap-1">
              <span className="opacity-70">🕐</span>
              <span>
                {item.start} - {item.end}
              </span>
            </div>
            {item.location && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">📍</span>
                <span>{item.location}</span>
              </div>
            )}
            {item.cost && (
              <div className="flex items-center gap-1">
                <span className="opacity-70">💰</span>
                <span>Rp {item.cost.toLocaleString("id-ID")}</span>
              </div>
            )}
            {item.description && (
              <div className="mt-1 border-t border-white/10 pt-1">
                <p className="leading-relaxed">{item.description}</p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
