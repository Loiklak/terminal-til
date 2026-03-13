import type { AnimationMode } from "./animation";

const HAPTIC_PATTERNS: Record<Exclude<AnimationMode, "none">, number[]> = {
  terminal: [30, 60, 40],
  confetti: [40, 30, 50, 30, 40],
};

export function triggerCelebration(mode: AnimationMode): void {
  if (mode === "none") return;
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;

  navigator.vibrate(HAPTIC_PATTERNS[mode]);
}
