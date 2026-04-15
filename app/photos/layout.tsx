import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photos | Dawra",
  description: "Browse and manage your photo memories.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="container mx-auto p-3">{children}</section>
}
