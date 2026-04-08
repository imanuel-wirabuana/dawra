import { Geist, Geist_Mono, Figtree, Pacifico } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb"
import ChatWidget from "@/components/ChatWidget"
import Providers from "./providers"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-brand",
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
        pacifico.variable
      )}
    >
      <body>
        <Providers>
          <TooltipProvider>
            <ThemeProvider>
              <Navbar className="sticky top-0 z-50" />
              <DynamicBreadcrumb />
              {children}
              <ChatWidget />
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
