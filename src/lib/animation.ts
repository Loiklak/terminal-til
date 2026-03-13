const ALL_ANIMATIONS = ["terminal", "confetti", "none"] as const;
export type AnimationMode = (typeof ALL_ANIMATIONS)[number];

const STORAGE_KEY = "riced-animation";

export function setAnimation(mode: AnimationMode): void {
  localStorage.setItem(STORAGE_KEY, mode);
}

export function getAnimation(): AnimationMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (ALL_ANIMATIONS as readonly string[]).includes(stored)) {
    return stored as AnimationMode;
  }
  return "terminal";
}
