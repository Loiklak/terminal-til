const ALL_SCHEMES = ["catppuccin", "tokyonight", "dracula", "gruvbox", "nord"] as const;
export type Scheme = (typeof ALL_SCHEMES)[number];

export function setTheme(scheme: Scheme): void {
  const root = document.documentElement;
  for (const s of ALL_SCHEMES) root.classList.remove(s);
  root.classList.add(scheme);
  localStorage.setItem("riced-scheme", scheme);
}

export function getTheme(): Scheme {
  const stored = localStorage.getItem("riced-scheme");
  if (stored && (ALL_SCHEMES as readonly string[]).includes(stored)) {
    return stored as Scheme;
  }
  return "catppuccin";
}
