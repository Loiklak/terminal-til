import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher, getThemeEmoji } from "./theme-switcher.tsx";
import { AnimationSwitcher, getAnimationEmoji } from "./animation-switcher.tsx";
import type { AnimationMode } from "@/lib/animation.ts";
import type { Scheme } from "@/lib/theme.ts";

interface SettingsPanelProps {
  animationMode: AnimationMode;
  onAnimationChange: (mode: AnimationMode) => void;
  theme: Scheme;
  onThemeChange: (scheme: Scheme) => void;
}

export function SettingsPanel({
  animationMode,
  onAnimationChange,
  theme,
  onThemeChange,
}: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Settings"
        aria-expanded={open}
        className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors hover:bg-surface-1"
      >
        <span aria-hidden="true">{getThemeEmoji(theme)}</span>
        <span aria-hidden="true">{getAnimationEmoji(animationMode)}</span>
      </button>

      {open && (
        <>
          {/* Desktop: popover */}
          <div className="hidden sm:block absolute right-0 top-full mt-2 z-20 rounded-md border border-border bg-base p-3 shadow-lg min-w-56">
            <p className="text-xs text-muted-foreground mb-2">theme</p>
            <ThemeSwitcher active={theme} onChange={onThemeChange} />
            <hr className="my-3 border-border" />
            <p className="text-xs text-muted-foreground mb-2">animation</p>
            <AnimationSwitcher active={animationMode} onChange={onAnimationChange} />
          </div>

          {/* Mobile: bottom sheet with backdrop */}
          <div className="sm:hidden fixed inset-0 z-20">
            <div
              className="absolute inset-0 bg-background/60"
              onClick={() => setOpen(false)}
              data-testid="settings-backdrop"
            />
            <div className="absolute bottom-0 left-0 right-0 rounded-t-lg border-t border-border bg-base p-4 pb-8">
              <p className="text-xs text-muted-foreground mb-2">theme</p>
              <ThemeSwitcher active={theme} onChange={onThemeChange} />
              <hr className="my-3 border-border" />
              <p className="text-xs text-muted-foreground mb-2">animation</p>
              <AnimationSwitcher active={animationMode} onChange={onAnimationChange} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
