import { setTheme, getTheme, type Scheme } from './lib/theme.ts'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
    <div className="min-h-screen p-8">
      <header className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-1">
          terminal-til
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
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
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {s.name}
            </button>
          ))}
        </nav>

        {/* Surface scale demo */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Surface Scale
          </h2>
          <div className="flex gap-3">
            {[
              { name: "crust", cls: "bg-crust" },
              { name: "base", cls: "bg-base" },
              { name: "surface-0", cls: "bg-surface-0" },
              { name: "surface-1", cls: "bg-surface-1" },
            ].map((s) => (
              <div
                key={s.name}
                className={`flex-1 rounded-lg p-4 border border-border ${s.cls}`}
              >
                <span className="text-xs text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Color tokens demo */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Semantic Colors
          </h2>
          <div className="flex gap-3">
            {[
              { name: "primary", cls: "bg-primary" },
              { name: "success", cls: "bg-success" },
              { name: "warning", cls: "bg-warning" },
              { name: "error", cls: "bg-error" },
              { name: "info", cls: "bg-info" },
            ].map((c) => (
              <div key={c.name} className="flex-1 text-center">
                <div className={`h-10 rounded-lg mb-2 ${c.cls}`} />
                <span className="text-xs text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Button variants demo */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Button
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button disabled>Disabled</Button>
            <Button variant="ghost" disabled>Ghost Disabled</Button>
          </div>
        </section>

        {/* Card demo */}
        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Card
          </h2>
          <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
            <h3 className="text-primary font-bold mb-2">$ today i learned</h3>
            <p className="text-sm text-muted-foreground">
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
