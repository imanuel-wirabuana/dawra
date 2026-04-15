import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Activities | Dawra",
  description:
    "Track your activities and experiences.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="container mx-auto p-3">{children}</section>
}
