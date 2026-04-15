import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bucket Lists | Dawra",
  description:
    "Track your goals and dreams. Add items, organize by categories, and mark them as complete.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="container mx-auto p-3">{children}</section>
}
