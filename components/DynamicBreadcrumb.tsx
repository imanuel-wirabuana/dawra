"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ChevronRight,
  Target,
  Calendar,
  Camera,
  MessageCircle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

const SEGMENT_ICONS: Record<string, LucideIcon> = {
  "bucket-lists": Target,
  itineraries: Calendar,
  photos: Camera,
  chats: MessageCircle,
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

function truncateName(name: string, maxLength: number): string {
  if (name.length <= maxLength) return name
  return `${name.slice(0, maxLength)}...`
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
        <HomeLink />
        {segments.map((segment, index) => (
          <BreadcrumbSegment
            key={segment}
            segment={segment}
            index={index}
            segments={segments}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function HomeLink() {
  return (
    <BreadcrumbItem>
      <BreadcrumbLink
        href="/"
        className="flex items-center gap-1 rounded-full p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}

interface BreadcrumbSegmentProps {
  segment: string
  index: number
  segments: string[]
}

function BreadcrumbSegment({
  segment,
  index,
  segments,
}: BreadcrumbSegmentProps) {
  const href = `/${segments.slice(0, index + 1).join("/")}`
  const isLast = index === segments.length - 1
  const formattedName = formatBreadcrumbName(segment)
  const Icon = SEGMENT_ICONS[segment]

  return (
    <div className="flex items-center">
      <ChevronRight className="mx-0.5 h-3 w-3 text-muted-foreground/30" />
      <BreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {Icon && <Icon className="h-3 w-3" />}
            <span className="hidden sm:inline">{formattedName}</span>
            <span className="sm:hidden">{truncateName(formattedName, 8)}</span>
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
}
