import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dawra - Bucket List",
  description: "Dawra - Bucket List",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto mt-3 px-7 lg:px-27">
      {children}
    </section>
  )
}
