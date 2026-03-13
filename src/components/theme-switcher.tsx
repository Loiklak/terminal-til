import { setTheme, type Scheme } from "@/lib/theme.ts";

interface ThemeSwitcherProps {
  active: Scheme;
  onChange: (scheme: Scheme) => void;
}

const SCHEMES: { key: Scheme; name: string; emoji: string }[] = [
  { key: "catppuccin", name: "Catppuccin", emoji: "\uD83D\uDC31" },
  { key: "tokyonight", name: "Tokyo Night", emoji: "\uD83C\uDF03" },
  { key: "dracula", name: "Dracula", emoji: "\uD83E\uDDDB" },
  { key: "gruvbox", name: "Gruvbox", emoji: "\uD83C\uDF3E" },
  { key: "nord", name: "Nord", emoji: "\u2744\uFE0F" },
];

export function getThemeEmoji(scheme: Scheme): string {
  return SCHEMES.find((s) => s.key === scheme)?.emoji ?? SCHEMES[0].emoji;
}

export function ThemeSwitcher({ active, onChange }: ThemeSwitcherProps) {
  function handleSwitch(scheme: Scheme) {
    setTheme(scheme);
    onChange(scheme);
  }

  return (
    <nav className="flex flex-wrap gap-1" aria-label="Theme switcher">
      {SCHEMES.map((s) => (
        <button
          key={s.key}
          onClick={() => handleSwitch(s.key)}
          aria-label={`Switch to ${s.name} theme`}
          aria-pressed={active === s.key}
          className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-all
            ${
              active === s.key
                ? "bg-surface-1 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <span aria-hidden="true">{s.emoji}</span>
          {s.name}
        </button>
      ))}
    </nav>
  );
}
