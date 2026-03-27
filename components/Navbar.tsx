"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavbarProps {
  className?: string
}

export default function Navbar({ className }: NavbarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/bucket-list", label: "Bucket List" },
  ]

  return (
    <nav className={className}>
      <div className="mx-auto bg-sidebar py-3 shadow">
        <div className="flex items-center justify-between px-7 lg:px-27">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Dawra</h1>
          </div>
          <div className="flex items-center gap-7">
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
        </div>
      </div>
    </nav>
  )
}
