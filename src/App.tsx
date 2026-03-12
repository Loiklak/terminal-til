import { setTheme, getTheme, type Scheme } from './lib/theme.ts'
import { useState } from 'react'

const SCHEMES: { key: Scheme; name: string }[] = [
  { key: "catppuccin", name: "Catppuccin" },
  { key: "tokyonight", name: "Tokyo Night" },
  { key: "dracula", name: "Dracula" },
  { key: "gruvbox", name: "Gruvbox" },
  { key: "nord", name: "Nord" },
]

function App() {
  const [active, setActive] = useState<Scheme>(getTheme)

  function handleSwitch(scheme: Scheme) {
    setTheme(scheme)
    setActive(scheme)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <header className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[var(--primary)] mb-1">
          terminal-til
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-8">
          design system — phase 1
        </p>

        {/* Theme switcher */}
        <nav className="flex gap-1 mb-12">
          {SCHEMES.map((s) => (
            <button
              key={s.key}
              onClick={() => handleSwitch(s.key)}
              className={`px-3 py-1 text-xs border-b-2 transition-colors
                ${active === s.key
                  ? "border-[var(--primary)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
            >
              {s.name}
            </button>
          ))}
        </nav>

        {/* Surface scale demo */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
            Surface Scale
          </h2>
          <div className="flex gap-3">
            {[
              { name: "crust", var: "--crust" },
              { name: "base", var: "--base" },
              { name: "surface-0", var: "--surface-0" },
              { name: "surface-1", var: "--surface-1" },
            ].map((s) => (
              <div
                key={s.name}
                className="flex-1 rounded-[var(--radius)] p-4 border border-[var(--border)]"
                style={{ backgroundColor: `var(${s.var})` }}
              >
                <span className="text-xs text-[var(--muted-foreground)]">{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Color tokens demo */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
            Semantic Colors
          </h2>
          <div className="flex gap-3">
            {[
              { name: "primary", var: "--primary" },
              { name: "success", var: "--color-success" },
              { name: "warning", var: "--color-warning" },
              { name: "error", var: "--color-error" },
              { name: "info", var: "--color-info" },
            ].map((c) => (
              <div key={c.name} className="flex-1 text-center">
                <div
                  className="h-10 rounded-[var(--radius)] mb-2"
                  style={{ backgroundColor: `var(${c.var})` }}
                />
                <span className="text-xs text-[var(--muted-foreground)]">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Card demo */}
        <section>
          <h2 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
            Card
          </h2>
          <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-[var(--radius)] border border-[var(--border)] p-6">
            <h3 className="text-[var(--primary)] font-bold mb-2">$ today i learned</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              The design system is working. All tokens resolve from CSS variables.
              Switch themes above — no React re-render needed for the color swap.
            </p>
          </div>
        </section>
      </header>
    </div>
  )
}

export default App
