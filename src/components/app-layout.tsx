import type { ReactNode } from "react";
import { SettingsPanel } from "./settings-panel.tsx";
import type { AnimationMode } from "@/lib/animation.ts";
import type { Scheme } from "@/lib/theme.ts";

interface AppLayoutProps {
  children: ReactNode;
  animationMode: AnimationMode;
  onAnimationChange: (mode: AnimationMode) => void;
  theme: Scheme;
  onThemeChange: (scheme: Scheme) => void;
}

export function AppLayout({
  children,
  animationMode,
  onAnimationChange,
  theme,
  onThemeChange,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-base">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <h1 className="text-sm font-bold text-primary">terminal-til</h1>
          <SettingsPanel
            animationMode={animationMode}
            onAnimationChange={onAnimationChange}
            theme={theme}
            onThemeChange={onThemeChange}
          />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
