

import Link from "next/link"
import { cn } from "@/lib/utils"

interface BrandProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Brand({ className, size = "md" }: BrandProps) {

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl",
  }

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-1.5 font-bold",
        "[font-family:'Concert One',cursive]",
        "transition-all duration-300 hover:opacity-80",
        sizeClasses[size],
        className
      )}
    >
      
      <span className="text-foreground">
        <span className="text-primary">D</span>awra
      </span>
    </Link>
  )
}
