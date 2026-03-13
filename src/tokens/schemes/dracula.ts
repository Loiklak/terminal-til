import type { Scheme } from "../schema.ts";

export const dracula: Scheme = {
  name: "Dracula",
  className: "dracula",

  background: "#282a36",
  foreground: "#f8f8f2",
  card: "#21222c",
  cardForeground: "#f8f8f2",
  popover: "#21222c",
  popoverForeground: "#f8f8f2",
  primary: "#bd93f9",
  primaryForeground: "#21222c",
  secondary: "#44475a",
  secondaryForeground: "#f8f8f2",
  muted: "#44475a",
  mutedForeground: "#6272a4",
  accent: "#44475a",
  accentForeground: "#f8f8f2",
  destructive: "#ff5555",
  destructiveForeground: "#21222c",
  border: "#44475a",
  input: "#44475a",
  ring: "#bd93f9",
  radius: "0.25rem",

  crust: "#191a21",
  base: "#21222c",
  surface0: "#44475a",
  surface1: "#6272a4",

  colorSuccess: "#50fa7b",
  colorWarning: "#f1fa8c",
  colorError: "#ff5555",
  colorInfo: "#8be9fd",

  durationFast: "100ms",
  durationNormal: "200ms",
  easeDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
};
