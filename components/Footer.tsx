export default function Footer() {
  return (
    <footer className="mt-7">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold text-primary">Dawra</span>. All rights
          reserved. Made with <span className="text-red-500">❤</span> by{" "}
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
