import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-7 mb-14">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm text-muted-foreground">
          {new Date().getFullYear()}{" "}
          <span className="font-bold text-primary">Dawra</span>. All rights
          reserved. Made with{" "}
          <Heart className="inline-block h-4 w-4 text-red-500 fill-red-500" /> by{" "}
          <a
            href="https://github.com/imanuel-wirabuana"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:underline"
          >
            Fio
          </a>
        </p>
      </div>
    </footer>
  )
}
