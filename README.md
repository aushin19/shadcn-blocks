# shadcn-blocks

A GitHub hosted shadcn/ui registry built with Next.js, Base UI, and Tailwind CSS v4. Registry items are listed in `registry.json`, and the shadcn CLI fetches their source from this repository.

## Run locally

```bash
npm ci
npm run dev
```

Open <http://localhost:3000> to preview the data import empty state. Registry JSON is generated before `npm run dev` and `npm run build`.

| Endpoint | Purpose |
| --- | --- |
| `/r/registry.json` | Generated catalog |
| `/r/data-import-empty-state.json` | Records empty state block |
| `/r/frame.json` | Card based frame composition |

## Install a registry item

Run these commands in a separate project initialized with shadcn/ui and Tailwind CSS v4:

```bash
npx shadcn@latest list aushin19/shadcn-blocks
npx shadcn@latest view aushin19/shadcn-blocks/data-import-empty-state
npx shadcn@latest add aushin19/shadcn-blocks/data-import-empty-state
npx shadcn@latest add aushin19/shadcn-blocks/frame
```

The block uses the consumer's local shadcn `button`, `card`, `empty`, and `skeleton` components.

```tsx
import { DataImportEmptyState } from "@/components/data-import-empty-state"

export default function Page() {
  return <DataImportEmptyState />
}
```

## Add registry items

1. Put distributable UI component source in `registry/ui/` and block source in `registry/blocks/`.
2. Register every source file in the root `registry.json`. Use `registry:ui` for UI items and `registry:component` for block implementation files.
3. Build new compositions only from local shadcn components imported through `@/components/ui/...`. `lucide-react` is allowed for icon-only JSX; do not render components from other UI libraries.
4. Use existing Tailwind theme tokens for color and typography. Keep static utility classes in the TSX source. Do not add component CSS or stylesheets.
5. Run `npm run check:registry-structure`, `npm run test:registry`, `npm run test:design-system`, `npm run check:design-system-css`, `npm run lint`, and `npm run registry:build` after changes.

## Design and styling rules

Components and blocks use the existing design tokens from `app/globals.css` through semantic Tailwind classes. Keep `app/globals.css` limited to the existing token map and approved base typography rules. Do not add component selectors or component-specific colors, fonts, or typography there.

Keep component-specific styling in static utility classes in the component TSX file. When needed, define a local token alias in that file's `style` object and point it directly to an existing `global.css` token. Do not use raw colors, other arbitrary values, dynamic class strings, `<style>` tags, additional icon packages, decorative media, or presentation-only wrappers. Use only `*Icon` exports from the configured `lucide-react` library for icons. Do not pass visual override props or prop spreads from a custom composition.

`npm run lint` runs `@shadcn/lint` and repository rules that require local shadcn components, constrain utility classes, and reject CSS files outside `app/globals.css`. The design system CSS check rejects component rules or unapproved declarations in the global stylesheet.

## CI and Codex hooks

Run the same checks as GitHub Actions locally:

```bash
npm run ci:local
```

CI runs registry structure checks and tests, design system CSS tests, shadcn lint, TypeScript, and a production build. GitHub Actions runs `npm run ci:local` on pushes and pull requests.

The Codex PostToolUse hook runs registry checks, shadcn lint, local-token validation, and the global CSS check after matching coding tool calls. The Stop hook adds registry and design system tests.

## Generated files

Source files are authoritative. Generated `public/r/*.json` files are ignored by Git and recreated by `npm run registry:build`.

## References

- [Registry getting started](https://ui.shadcn.com/docs/registry/getting-started)
- [Registry catalog schema](https://ui.shadcn.com/docs/registry/registry-json)
- [Registry item schema](https://ui.shadcn.com/docs/registry/registry-item-json)
- [GitHub registries](https://ui.shadcn.com/docs/registry/github)
- [shadcn/ui Lint](https://github.com/shadcn-ui/lint)
