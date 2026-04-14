"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ListTodo,
  Calendar,
  Image,
  MessageCircle,
  Plus,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollProgress } from "@/hooks/useScrollProgress"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Bucket Lists", href: "/bucket-lists", icon: ListTodo },
  { label: "Itinerary", href: "/itineraries", icon: Calendar },
  { label: "Photos", href: "/photos", icon: Image },
  { label: "Chat", href: "/chats", icon: MessageCircle },
]

interface BottomNavigationProps {
  className?: string
  showOnDesktop?: boolean
}

export function BottomNavigation({
  className,
  showOnDesktop = false,
}: BottomNavigationProps) {
  const pathname = usePathname()
  const { scrollDirection } = useScrollProgress()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Hide nav when scrolling down, show when scrolling up
  const shouldShow =
    scrollDirection === "up" || scrollDirection === null || pathname === "/"

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <motion.nav
        className={cn(
          "fixed right-0 bottom-0 left-0 z-50 md:hidden",
          !showOnDesktop && "lg:hidden",
          className
        )}
        initial={{ y: 100 }}
        animate={{ y: shouldShow ? 0 : 100 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="pb-safe border-t border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/")

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex min-w-16 flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300",
                      isMobile ? "px-3 py-2.5" : "px-3 py-2",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <motion.div whileTap={{ scale: 0.9 }} className="relative">
                      <Icon
                        className={cn(
                          "transition-transform duration-300",
                          isMobile ? "h-5 w-5" : "h-4 w-4"
                        )}
                      />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        "font-medium transition-all duration-200",
                        isMobile ? "text-[10px]" : "text-[10px]"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              )
            })}

            {/* Add Button */}
            <motion.button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={cn(
                "relative flex min-w-16 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all duration-200",
                showAddMenu
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              whileTap={{ scale: 0.9 }}
              aria-label="Add new"
              aria-expanded={showAddMenu}
            >
              <motion.div
                animate={{ rotate: showAddMenu ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="h-5 w-5" />
              </motion.div>
              <span className="text-[10px] font-medium">Add</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Add Menu Sheet */}
      <AnimatePresence>
        {showAddMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddMenu(false)}
            />

            {/* Menu Sheet */}
            <motion.div
              className="fixed right-4 bottom-20 left-4 z-50 overflow-hidden rounded-2xl border border-border/40 bg-background/95 shadow-xl backdrop-blur-xl md:hidden"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="p-2">
                <AddMenuItem
                  href="/bucket-lists/new"
                  icon={ListTodo}
                  label="New Bucket List Item"
                  description="Add a destination or activity"
                  onClick={() => setShowAddMenu(false)}
                />
                <AddMenuItem
                  href="/itineraries/new"
                  icon={Calendar}
                  label="New Itinerary Item"
                  description="Plan your next activity"
                  onClick={() => setShowAddMenu(false)}
                />
                <AddMenuItem
                  href="/photos/upload"
                  icon={Image}
                  label="Upload Photos"
                  description="Add photos to your gallery"
                  onClick={() => setShowAddMenu(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function AddMenuItem({
  href,
  icon: Icon,
  label,
  description,
  onClick,
}: {
  href: string
  icon: React.ElementType
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}

// Desktop Side Navigation
export function SideNavigation({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("hidden w-64 flex-col gap-1 p-4 md:flex", className)}
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href || pathname?.startsWith(item.href + "/")

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
              isActive
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="sideActiveIndicator"
                className="h-1.5 w-1.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
