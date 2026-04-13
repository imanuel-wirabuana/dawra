import { Geist, Geist_Mono, Figtree, Pacifico, Parisienne } from "next/font/google"
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
      <body>
        <Providers>
          <TooltipProvider>
            <ThemeProvider>
              {/* <Navbar className="sticky top-0 z-50" /> */}
              <header className="container mx-auto px-4 py-3 sm:px-6 lg:px-8 border-b-4 border-muted border-dashed">
                <div className="flex flex-row items-center justify-between">
                  <Brand size="md" />
                  <DynamicBreadcrumb />
                </div>
              </header>
              {children}
              <Footer />
              <FloatingNav />
              <ChatWidget />
              <Toaster position="top-center" richColors />
            </ThemeProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
