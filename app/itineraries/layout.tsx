import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Itineraries | Dawra",
  description: "Plan your daily activities and schedule events.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {children}
    </section>
  )
}
