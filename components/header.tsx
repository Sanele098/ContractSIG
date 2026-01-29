"use client"

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-2V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-10-2h8v2h-8V4zm10 14H4V8h16v10zm-11-7h6a1 1 0 0 0 0-2h-6a1 1 0 0 0 0 2zm0 4h6a1 1 0 0 0 0-2h-6a1 1 0 0 0 0 2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-foreground">ContractSIG</span>
          </div>
          <nav className="hidden gap-8 md:flex">
            <a href="/use-cases" className="text-sm text-foreground hover:text-primary">
              Use Cases
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary">
              Platform
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary">
              Features
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary">
              How It Works
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary">
              Resources
            </a>
          </nav>
          <button className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Get Started
          </button>
        </div>
      </div>
    </header>
  )
}
