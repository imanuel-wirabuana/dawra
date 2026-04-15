import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Itineraries | Dawra",
  description: "Plan your daily activities and schedule events.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="container mx-auto p-3">{children}</section>
}
