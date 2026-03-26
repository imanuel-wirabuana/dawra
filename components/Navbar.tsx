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

  return (
    <nav className={className}>
      <div className="mx-auto bg-sidebar py-3 shadow">
        <div className="flex items-center justify-between px-7 lg:px-27">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Dawra</h1>
          </div>
          <div className="flex items-center gap-7">
            <Link
              href="/"
              className={
                isActive("/")
                  ? "font-semibold text-primary"
                  : "transition-colors hover:text-primary"
              }
            >
              Home
            </Link>
            <Link
              href="/bucket-list"
              className={
                isActive("/bucket-list")
                  ? "font-semibold text-primary"
                  : "transition-colors hover:text-primary"
              }
            >
              Bucket List
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
