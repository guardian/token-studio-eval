# token-studio-eval

This repository stores Tokens Studio token exports and builds CSS custom properties with [Terrazzo](https://terrazzo.app/docs/).

## Commands

- `corepack enable` enables the repository's pinned pnpm version.
- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm run build` generates a Terrazzo resolver from `tokens/$themes.json`, validates the configured token files, and writes `dist/tokens.css`.
- `pnpm run lint` runs Terrazzo's token linting.
- `pnpm run storybook` starts the React component explorer at `http://localhost:6006`.
- `pnpm run build-storybook` creates a static Storybook build in `storybook-static/`.

`tokens/$metadata.json` and `tokens/$themes.json` remain Tokens Studio control files. The build automatically converts their selected token sets into Terrazzo theme contexts.

## Themes

The generated CSS defaults to `color-mode-light--brand-default`. Set `data-theme` on the document root to select another combination:

```html
<html data-theme="color-mode-dark--brand-sr"></html>
```

The current themes are `color-mode-light--brand-default`, `color-mode-dark--brand-default`, `color-mode-light--brand-sr`, and `color-mode-dark--brand-sr`.
