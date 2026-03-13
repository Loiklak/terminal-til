import { useState } from "react"
import { setTheme, getTheme, type Scheme } from "@/lib/theme.ts"

const SCHEMES: { key: Scheme; name: string; emoji: string; color: string }[] = [
  { key: "catppuccin", name: "Catppuccin", emoji: "🐱", color: "#cba6f7" },
  { key: "tokyonight", name: "Tokyo Night", emoji: "🌃", color: "#7aa2f7" },
  { key: "dracula", name: "Dracula", emoji: "🧛", color: "#bd93f9" },
  { key: "gruvbox", name: "Gruvbox", emoji: "🌾", color: "#d79921" },
  { key: "nord", name: "Nord", emoji: "❄️", color: "#88c0d0" },
]

export function ThemeSwitcher() {
  const [active, setActive] = useState<Scheme>(getTheme)

  function handleSwitch(scheme: Scheme) {
    setTheme(scheme)
    setActive(scheme)
  }

  return (
    <nav className="flex gap-0 sm:gap-1" aria-label="Theme switcher">
      {SCHEMES.map((s) => (
        <button
          key={s.key}
          onClick={() => handleSwitch(s.key)}
          title={s.name}
          aria-label={`Switch to ${s.name} theme`}
          aria-pressed={active === s.key}
          className={`min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 inline-flex items-center justify-center transition-all sm:px-2 sm:py-1 sm:text-xs sm:border-b-2
            ${active === s.key
              ? "sm:border-primary sm:text-foreground"
              : "sm:border-transparent sm:text-muted-foreground sm:hover:text-foreground"
            }`}
        >
          {/* Emoji on mobile */}
          <span
            className={`sm:hidden text-base transition-all
              ${active === s.key ? "scale-125" : "opacity-50 hover:opacity-100"}`}
            aria-hidden="true"
          >
            {s.emoji}
          </span>
          {/* Emoji + label on sm+ */}
          <span className="hidden sm:inline">{s.emoji} {s.name}</span>
        </button>
      ))}
    </nav>
  )
}
