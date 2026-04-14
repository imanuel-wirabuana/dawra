import {
  Geist,
  Geist_Mono,
  Figtree,
  Pacifico,
  Parisienne,
} from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import FloatingNav from "@/components/FloatingNav"
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb"
import ChatWidget from "@/components/ChatWidget"
import Providers from "./providers"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/Footer"
import { Brand } from "@/components/Brand"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-brand",
})

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cursive",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Dawra",
  description: "Dawra - A modern web application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        figtree.variable,
        pacifico.variable,
        parisienne.variable
      )}
    >
      <body className="min-h-screen bg-background">
        <Providers>
          <TooltipProvider delayDuration={200}>
            <ThemeProvider>
              {/* Modern Glassmorphism Header */}
              <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-2xl transition-all duration-300">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                  <Brand size="md" />
                  <div className="flex items-center gap-4">
                    <DynamicBreadcrumb />
                  </div>
                </div>
              </header>

              {/* Main Content with refined spacing */}
              <main className="relative flex-1">{children}</main>

              {/* Elegant Footer */}
              <Footer />

              {/* Floating Navigation */}
              <FloatingNav />

              {/* Chat Widget */}
              <ChatWidget />

              {/* Toast Notifications */}
              <Toaster position="top-center" richColors />
            </ThemeProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
