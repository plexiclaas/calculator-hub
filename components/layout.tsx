import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Skip link für Accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-neutral-900 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="font-semibold tracking-tight">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
              Calculator Hub
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden gap-6 text-sm text-neutral-700 md:flex">
            <Link href="/calculators" className="hover:text-neutral-900">Calculators</Link>
            <Link href="/about" className="hover:text-neutral-900">About</Link>
            <Link href="/legal" className="hover:text-neutral-900">Legal</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main id="main">
        <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-neutral-600 md:flex-row">
          <p>© {new Date().getFullYear()} Calculator Hub</p>
          <div className="flex items-center gap-5">
            <Link href="/legal" className="hover:text-neutral-900">Imprint & Privacy</Link>
            <Link href="/contact" className="hover:text-neutral-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
