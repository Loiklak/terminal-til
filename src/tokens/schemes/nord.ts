import type { Scheme } from "../schema.ts";

export const nord: Scheme = {
  name: "Nord",
  className: "nord",

  background: "#2e3440",
  foreground: "#d8dee9",
  card: "#3b4252",
  cardForeground: "#d8dee9",
  popover: "#3b4252",
  popoverForeground: "#d8dee9",
  primary: "#88c0d0",
  primaryForeground: "#2e3440",
  secondary: "#434c5e",
  secondaryForeground: "#d8dee9",
  muted: "#4c566a",
  mutedForeground: "#81a1c1",
  accent: "#434c5e",
  accentForeground: "#d8dee9",
  destructive: "#bf616a",
  destructiveForeground: "#eceff4",
  border: "#4c566a",
  input: "#4c566a",
  ring: "#88c0d0",
  radius: "0.75rem",

  crust: "#242933",
  base: "#2e3440",
  surface0: "#3b4252",
  surface1: "#434c5e",

  colorSuccess: "#a3be8c",
  colorWarning: "#ebcb8b",
  colorError: "#bf616a",
  colorInfo: "#81a1c1",

  durationFast: "100ms",
  durationNormal: "200ms",
  easeDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
};
