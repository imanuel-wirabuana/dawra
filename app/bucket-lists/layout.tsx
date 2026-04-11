import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dawra - Bucket Lists",
  description: "Dawra - Bucket Lists",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto mt-3 px-7 lg:px-17">
      {children}
    </section>
  )
}
