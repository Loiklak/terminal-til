import type { Scheme } from "../schema.ts"

export const catppuccin: Scheme = {
  name: "Catppuccin Mocha",
  className: "catppuccin",

  background: "#1e1e2e",
  foreground: "#cdd6f4",
  card: "#181825",
  cardForeground: "#cdd6f4",
  popover: "#181825",
  popoverForeground: "#cdd6f4",
  primary: "#cba6f7",
  primaryForeground: "#11111b",
  secondary: "#313244",
  secondaryForeground: "#a6adc8",
  muted: "#45475a",
  mutedForeground: "#6c7086",
  accent: "#313244",
  accentForeground: "#cdd6f4",
  destructive: "#f38ba8",
  destructiveForeground: "#11111b",
  border: "#45475a",
  input: "#45475a",
  ring: "#cba6f7",
  radius: "0.5rem",

  crust: "#11111b",
  base: "#181825",
  surface0: "#313244",
  surface1: "#45475a",

  colorSuccess: "#a6e3a1",
  colorWarning: "#f9e2af",
  colorError: "#f38ba8",
  colorInfo: "#89b4fa",

  durationFast: "100ms",
  durationNormal: "200ms",
  easeDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
}
