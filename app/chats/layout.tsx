import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chats | Dawra",
  description: "Connect and chat with others in real-time.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="container mx-auto p-3">{children}</section>
}
