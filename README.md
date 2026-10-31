# shadcn-blocks

A GitHub-hosted shadcn registry for reusable UI components and blocks. Source lives in `registry/ui/` and `registry/blocks/`; the shadcn CLI reads the root `registry.json` and installs each item's declared dependencies.

## Install a block

Initialize shadcn once in a new consumer project:

```bash
npx shadcn@latest init
```

Then install a block and its shared design system, primitives, npm packages, and fonts with one command:

```bash
npx shadcn@latest add aushin19/shadcn-blocks/empty-state-1
```

The registry base keeps projects on `base-nova` and Base UI. It supplies the shared semantic color and radius tokens, Figtree and Geist Mono fonts, Lucide icons, and the `cn` utility. Each block includes the same base tokens in its item metadata, so one `add` command applies them along with its shadcn primitives and direct npm packages.

```tsx
import { EmptyState1 } from "@/components/empty-state-1"

export default function Page() {
  return <EmptyState1 />
}
```

## Registry items

| Item | Type | Purpose |
| --- | --- | --- |
| `base` | `registry:base` | Shared base, tokens, fonts, and icon setup |
| `empty-state-1` | `registry:block` | Records empty state with actions and quick guides |
| `frame` | `registry:ui` | Card-based frame composition |

GitHub Registry items can include source code, design tokens, dependencies, fonts, rules, and configuration. This repo uses the native GitHub registry form, so no registry server or generated JSON needs to be published. See the [shadcn GitHub Registry docs](https://ui.shadcn.com/docs/registry/github).

## Add a block or component

1. Put block source in `registry/blocks/` and distributable UI source in `registry/ui/`.
2. Add the item to `registry.json`. Every block and UI item must depend on `aushin19/shadcn-blocks/base`.
3. List every imported shadcn primitive in `registryDependencies` and every directly imported npm package in `dependencies`.
4. Use shadcn components by default. Use a ReUI or other external registry component only after the user selects that exact item. Put its full item URL in both `registryDependencies` and `registry-policy.json`, so consumer projects do not need another registry alias.
5. Keep component layout and local design-token aliases in the TSX file. Use semantic tokens from the shared base; do not add component CSS or component-specific global tokens.
6. Run `npm run ci:local` and install the item into a clean shadcn consumer before publishing.

## Design rules

Use local shadcn imports through `@/components/ui/...`. External registry items must be requested, listed explicitly, and consumed through the installed local UI alias. Do not import UI components directly from npm packages.

Use static Tailwind utilities and semantic design tokens. If a component needs a local token alias, define it in the component's own TSX `style` object and map it directly to an existing shared token. Do not use raw colors, dynamic classes, `<style>` elements, component stylesheets, decorative media, or presentation-only wrappers. Use `lucide-react` for icons.

`npm run lint` runs `@shadcn/lint` and repository rules for imports, tokens, styling, and presentation wrappers. `npm run check:registry-dependencies` checks declared UI and npm dependencies, exact external registry approvals, and that every item embeds the shared base tokens. `npm run check:design-system-css` limits the demo app's `app/globals.css` to shared tokens and approved base typography.

## CI and Codex hooks

Run the same checks as GitHub Actions locally:

```bash
npm run ci:local
```

CI runs registry structure and dependency checks, tests, design-system CSS validation, shadcn lint, TypeScript, and a production build. The Codex PostToolUse hook runs fast registry, dependency, lint, and CSS checks. Its Stop hook also runs registry and design-system tests.

## Generated files

Source files are authoritative. Generated `public/r/*.json` files are ignored by Git and recreated by `npm run registry:build` for local previews and hosted registry endpoints.
