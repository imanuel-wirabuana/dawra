"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Home,
  Target,
  Calendar,
  Camera,
  MessageCircle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavbarProps {
  className?: string
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bucket-lists", label: "Bucket Lists", icon: Target },
  { href: "/itineraries", label: "Itineraries", icon: Calendar },
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

export default function Navbar({ className }: NavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isActive = useActiveNav(pathname)

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className={className}>
      <div className="mx-auto border-b border-border/50 bg-sidebar/80 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="font-brand text-3xl tracking-normal">
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent dark:from-primary dark:to-primary/80">
                D
              </span>
              <span className="text-foreground dark:text-foreground/90">
                awra
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="cursor-pointer p-2 text-foreground md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 border-t border-border bg-sidebar/95 px-4 py-3 backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <MobileNavLink
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onClick={closeMobileMenu}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
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
        "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden lg:inline">{item.label}</span>
      {isActive && (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
      )}
    </Link>
  )
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void
}

function MobileNavLink({ item, isActive, onClick }: MobileNavLinkProps) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  )
}
