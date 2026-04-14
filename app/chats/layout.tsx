import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chats | Dawra",
  description: "Connect and chat with others in real-time.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {children}
    </section>
  )
}
