"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Target,
  Calendar,
  Camera,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  type LucideIcon,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useNavStore } from "@/store/navStore"
import { ThemeToggle } from "./ThemeToggle"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bucket-lists", label: "Bucket Lists", icon: Target },
  { href: "/itineraries", label: "Itineraries", icon: Calendar },
  { href: "/financials", label: "Financials", icon: Wallet },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/chats", label: "Chats", icon: MessageCircle },
]

function useActiveNav(pathname: string) {
  const isActive = (href: string): boolean => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }
  return isActive
}

export default function FloatingNav() {
  const pathname = usePathname()
  const { isExpanded, toggle } = useNavStore()
  const isActive = useActiveNav(pathname)

  const activeItem =
    NAV_ITEMS.find((item) => isActive(item.href)) ?? NAV_ITEMS[0]

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <motion.div
        layout
        className={cn(
          "flex items-center rounded-full border border-border/60 bg-card/90 py-2 shadow-2xl shadow-primary/10 backdrop-blur-xl",
          isExpanded ? "px-2" : "px-1.5"
        )}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <ExpandedNav key="expanded" isActive={isActive} onToggle={toggle} />
          ) : (
            <MinimizedNav
              key="minimized"
              activeItem={activeItem}
              onToggle={toggle}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  )
}

interface MinimizedNavProps {
  activeItem: NavItem
  onToggle: () => void
}

function MinimizedNav({ activeItem, onToggle }: MinimizedNavProps) {
  const ActiveIcon = activeItem.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-1"
    >
      <Link
        href={activeItem.href}
        className="group relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 p-2.5 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/35 active:scale-95"
        aria-label={activeItem.label}
      >
        <ActiveIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </span>
      </Link>
      <div className="[&_button]:h-8 [&_button]:w-8 [&_button]:rounded-full [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0">
        <ThemeToggle />
      </div>
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center rounded-full p-2 text-muted-foreground/70 transition-colors hover:bg-accent/50 hover:text-foreground"
        aria-label="Expand menu"
      >
        <ChevronUp className="h-4 w-4" />
      </motion.button>
    </motion.div>
  )
}

interface ExpandedNavProps {
  isActive: (href: string) => boolean
  onToggle: () => void
}

function ExpandedNav({ isActive, onToggle }: ExpandedNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-0.5"
    >
      {NAV_ITEMS.map((item, i) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
        >
          <NavLink item={item} isActive={isActive(item.href)} />
        </motion.div>
      ))}
      <div className="mx-1.5 h-5 w-px bg-border/50" />
      <div className="[&_button]:h-8 [&_button]:w-8 [&_button]:rounded-full [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0">
        <ThemeToggle />
      </div>
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center rounded-full p-2 text-muted-foreground/70 transition-colors hover:bg-accent/50 hover:text-foreground"
        aria-label="Collapse menu"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </motion.div>
  )
}

interface NavLinkProps {
  item: NavItem
  isActive: boolean
}

function NavLink({ item, isActive }: NavLinkProps) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-1.5 rounded-full px-3 py-2 transition-all duration-300",
        isActive
          ? "text-primary-foreground"
          : "text-muted-foreground/80 hover:bg-accent/40 hover:text-foreground"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          "relative z-10 h-4 w-4 transition-transform duration-300",
          isActive ? "scale-110" : "group-hover:scale-110"
        )}
      />
      <span className="relative z-10 text-xs font-medium whitespace-nowrap">
        {item.label}
      </span>
    </Link>
  )
}
