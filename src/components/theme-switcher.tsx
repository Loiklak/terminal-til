import { useState } from "react"
import { setTheme, getTheme, type Scheme } from "@/lib/theme.ts"

const SCHEMES: { key: Scheme; name: string }[] = [
  { key: "catppuccin", name: "Catppuccin" },
  { key: "tokyonight", name: "Tokyo Night" },
  { key: "dracula", name: "Dracula" },
  { key: "gruvbox", name: "Gruvbox" },
  { key: "nord", name: "Nord" },
]

export function ThemeSwitcher() {
  const [active, setActive] = useState<Scheme>(getTheme)

  function handleSwitch(scheme: Scheme) {
    setTheme(scheme)
    setActive(scheme)
  }

  return (
    <nav className="flex gap-1">
      {SCHEMES.map((s) => (
        <button
          key={s.key}
          onClick={() => handleSwitch(s.key)}
          className={`px-2 py-1 text-xs border-b-2 transition-colors
            ${active === s.key
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          {s.name}
        </button>
      ))}
    </nav>
  )
}
