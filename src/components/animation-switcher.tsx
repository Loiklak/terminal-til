import { setAnimation, type AnimationMode } from "@/lib/animation.ts";

interface AnimationSwitcherProps {
  active: AnimationMode;
  onChange: (mode: AnimationMode) => void;
}

const MODES: { key: AnimationMode; label: string; emoji: string }[] = [
  { key: "terminal", label: "Terminal", emoji: "\u26A1" },
  { key: "confetti", label: "Confetti", emoji: "\uD83C\uDF89" },
  { key: "none", label: "None", emoji: "\u2014" },
];

export function getAnimationEmoji(mode: AnimationMode): string {
  return MODES.find((m) => m.key === mode)?.emoji ?? MODES[0].emoji;
}

export function AnimationSwitcher({ active, onChange }: AnimationSwitcherProps) {
  function handleSwitch(mode: AnimationMode) {
    setAnimation(mode);
    onChange(mode);
  }

  return (
    <nav className="flex gap-1" aria-label="Animation switcher">
      {MODES.map((m) => (
        <button
          key={m.key}
          onClick={() => handleSwitch(m.key)}
          aria-label={`Switch to ${m.label} animation`}
          aria-pressed={active === m.key}
          className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-all
            ${
              active === m.key
                ? "bg-surface-1 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <span aria-hidden="true">{m.emoji}</span>
          {m.label}
        </button>
      ))}
    </nav>
  );
}
