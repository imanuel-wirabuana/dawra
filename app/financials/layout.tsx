import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Financials | Dawra",
  description: "Track and manage your travel expenses.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="container mx-auto p-3">{children}</section>
}
