"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, Calendar, Camera, MessageCircle, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavStore } from "@/store/navStore"
import { ThemeToggle } from "./ThemeToggle"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bucket-lists", label: "Bucket Lists", icon: Target },
  { href: "/itineraries", label: "Itineraries", icon: Calendar },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/chats", label: "Chats", icon: MessageCircle },
]

export default function FloatingNav() {
  const pathname = usePathname()
  const { isExpanded, toggle } = useNavStore()

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const activeItem = navItems.find((item) => isActive(item.href)) || navItems[0]
  const ActiveIcon = activeItem.icon

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        className={cn(
          "flex items-center py-1.5 rounded-full border border-border/50 bg-sidebar/90 shadow-lg backdrop-blur-md transition-all duration-300 ease-out",
          isExpanded ? "px-2" : "px-1.5 "
        )}
      >
        {!isExpanded ? (
          /* Minimized state - shows only active item + theme toggle + expand button */
          <div className="flex items-center gap-0.5">
            <Link
              href={activeItem.href}
              className="flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground"
            >
              <ActiveIcon className="h-4 w-4" />
            </Link>
            <div className="[&_button]:h-8 [&_button]:w-8 [&_button]:rounded-full [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0">
              <ThemeToggle />
            </div>
            <button
              onClick={toggle}
              className="flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Expand menu"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Maximized state - shows all nav items + theme toggle + collapse button */
          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                </Link>
              )
            })}
            <div className="h-4 w-px bg-border mx-0.5" />
            <div className="[&_button]:h-8 [&_button]:w-8 [&_button]:rounded-full [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0">
              <ThemeToggle />
            </div>
            <button
              onClick={toggle}
              className="flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Collapse menu"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
