"use client"

import { History } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ActivityList } from "./ActivityList"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

export function ActivitiesPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full cursor-pointer"
          aria-label="View activities"
        >
          <History className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={8}
        className="w-80 p-0"
        side="top"
      >
        <div className="flex flex-row justify-between border-b border-border/50 px-3 py-2">
          <h3 className="text-sm font-semibold">Recent Activity</h3>
          <Link href="/activities" className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full hover:underline">
            View all
          </Link>
        </div>
        <ScrollArea className="h-80">
          <ActivityList />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
