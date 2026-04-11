"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { Home, ChevronRight, Target, Calendar, Camera, MessageCircle, LucideIcon } from "lucide-react"
import Link from "next/link"

const segmentIcons: Record<string, LucideIcon> = {
  "bucket-lists": Target,
  "itineraries": Calendar,
  "photos": Camera,
  "chats": MessageCircle,
}

interface DynamicBreadcrumbProps {
  className?: string
}

function formatBreadcrumbName(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function DynamicBreadcrumb({
  className,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname()

  if (pathname === "/") {
    return null
  }

  const segments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb
      className={cn(
        "rounded-full border border-border/40 bg-muted/30 px-3 py-1.5 backdrop-blur-sm",
        className
      )}
    >
      <BreadcrumbList className="gap-0">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="flex items-center gap-1 rounded-full p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1
          const formattedName = formatBreadcrumbName(segment)
          const Icon = segmentIcons[segment]

          return (
            <div key={href} className="flex items-center">
              <ChevronRight className="mx-0.5 h-3 w-3 text-muted-foreground/30" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {Icon && <Icon className="h-3 w-3" />}
                    <span className="hidden sm:inline">{formattedName}</span>
                    <span className="sm:hidden">{formattedName.slice(0, 8)}{formattedName.length > 8 ? '...' : ''}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className="flex items-center gap-1 rounded-full p-1 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                    >
                      {Icon && <Icon className="h-3 w-3" />}
                      <span className="hidden sm:inline">{formattedName}</span>
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
