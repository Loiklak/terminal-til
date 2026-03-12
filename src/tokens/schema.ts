export interface Scheme {
  name: string
  className: string

  // shadcn core tokens
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  radius: string

  // Surface scale
  crust: string
  base: string
  surface0: string
  surface1: string

  // Semantic palette
  colorSuccess: string
  colorWarning: string
  colorError: string
  colorInfo: string

  // Motion
  durationFast: string
  durationNormal: string
  easeDefault: string
}
