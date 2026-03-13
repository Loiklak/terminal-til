import { WebHaptics } from "web-haptics";
import type { AnimationMode } from "./animation";

let instance: WebHaptics | null = null;

function getHaptics(): WebHaptics {
  if (!instance) {
    instance = new WebHaptics();
  }
  return instance;
}

const HAPTIC_PATTERNS: Record<Exclude<AnimationMode, "none">, string> = {
  terminal: "nudge",
  confetti: "success",
};

export function triggerCelebration(mode: AnimationMode): void {
  if (mode === "none") return;

  getHaptics().trigger(HAPTIC_PATTERNS[mode]);
}
