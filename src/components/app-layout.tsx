import type { ReactNode } from "react"
import { ThemeSwitcher } from "./theme-switcher.tsx"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-base">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <h1 className="text-sm font-bold text-primary">terminal-til</h1>
          <ThemeSwitcher />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
