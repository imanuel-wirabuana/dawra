"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

interface NavbarProps {
  className?: string
}

export default function Navbar({ className }: NavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/bucket-lists", label: "Bucket Lists" },
    { href: "/itineraries", label: "Itineraries" },
    { href: "/photos", label: "Photos" },
  ]

  return (
    <nav className={className}>
      <div className="mx-auto bg-sidebar py-3 shadow">
        <div className="flex items-center justify-between px-7 lg:px-27">
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
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive(item.href)
                    ? "font-semibold text-primary dark:brightness-150"
                    : "transition-colors hover:text-primary"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 border-t border-border bg-sidebar px-7 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={
                    isActive(item.href)
                      ? "font-semibold text-primary dark:brightness-150"
                      : "transition-colors hover:text-primary"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
