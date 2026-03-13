# Design Tokens

Typed theme system that generates CSS custom properties from TypeScript scheme definitions.

## How it works

1. Define a scheme in `schemes/` implementing the `Scheme` interface from `schema.ts`
2. Export it from `schemes/index.ts`
3. Register it in `generate.ts`
4. Run `pnpm generate-tokens`

This outputs `generated-themes.css` with CSS custom properties scoped to class selectors (`.catppuccin`, `.dracula`, etc.). The first scheme in the array is also applied to `:root`.

## Adding a new theme

1. Create `schemes/my-theme.ts` exporting a `Scheme` object
2. Add it to `schemes/index.ts` and the `schemes` array in `generate.ts`
3. Run `pnpm generate-tokens` — contrast warnings will flag accessibility issues

## Files

- `schema.ts` — `Scheme` interface (shadcn tokens + surfaces + semantic colors + motion)
- `generate.ts` — reads schemes, checks contrast ratios, writes CSS
- `generated-themes.css` — output (do not edit)
- `schemes/` — one file per theme
