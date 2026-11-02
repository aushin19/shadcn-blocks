## Non-Negotiables
- MUST use [no-ai-ui-slop](.agents\skills\no-ai-ui-slop\SKILL.md)
- ALWAYS create a pixel perfect replica/clone of the component/block and always compare side by side to match it.
- MUST use [REA](https://github.com/morluto/rea) and its skills and tools to create pixel perfect replica/clone.
- MUST use `@chorme` or `@Browser` plugins for `Chrome Devtool Protocol`.
- MUST use [frame md](https://reui.io/components/frame.md) and [frame docs](https://reui.io/components/frame) to get more context about ReUI Frame use.
- LOOK for if the component is using/need `frame` components to be used.

## Responses

- Be crisp: Get to the point. Avoid extra details.
- Use simple words: Avoid complex terms and jargon.
- Responde in Hinglish in chat (No Devnagri): Mix Hindi and English naturally in conversations (mostly hindi).
- English in code and repo: Keep all code, comments, docs, variables, and repo files in English.
- Keep it readable: Use short paragraphs, bullets, and tables.
- Use proper spacing: Keep content clean and easy to scan.
- No em-dashes: Use commas or full stops instead.
- Stay focused: Follow the request and avoid unnecessary explanations!

## Registry component folders

- Add every distributable UI component source file under `registry/ui/`.
- Add every block implementation source file under `registry/blocks/`.
- Keep registry source out of `components/ui/` and other folders. `components.json` aliases describe where the CLI installs files in consumer projects, not where registry source belongs.
- In the root `registry.json`, use `registry:ui` files from `registry/ui/`. Use `registry:component` files from `registry/blocks/` for block implementations. A block may include shared `registry:ui` files from `registry/ui/`.
- Run `npm run check:registry-structure` and `npm run test:registry` after changing registry items. Run `npm run ci:local` before publishing changes.

## Shadcn and user-approved registry components

- Build new compositions from shadcn components imported through `@/components/ui/...` by default.
- Use a ReUI or another external registry component only when the user selects that specific item. Add its exact registry URL to `registry-policy.json` and to the block's `registryDependencies` so consumers do not need extra registry configuration and CI can verify it.
- Keep external component code installed through the shadcn CLI and import it through the consumer's local UI alias. Do not import external component packages directly into a block.
- Install missing primitives with the shadcn CLI and keep the project on `base-nova` and Base UI. Do not mix in Radix versions.
- Utility and data imports are allowed when needed, but do not render their components as JSX. The configured `lucide-react` library is allowed for icon-only JSX; do not add other icon packages. Use semantic HTML only for document structure and shadcn or specifically approved registry components for visual controls and surfaces.
- Declare every directly imported npm package in the registry item's `dependencies`. Declare every imported `@/components/ui/...` primitive in `registryDependencies`.
- Every distributable UI item and block must include `aushin19/shadcn-blocks/base` and copy its `cssVars` exactly. The dependency provides shared setup and typography; item-level tokens ensure one `shadcn add` applies the full design system.



## Raw component architecture

- Build custom UI compositions and blocks from local shadcn components and user-approved registry components installed into the local UI folder. Keep imports on consumer-facing aliases such as `@/components/ui/button`, and declare the matching registry item.
- Use static Tailwind classes inside component JSX for layout, spacing, the existing typography scale, and semantic colors backed by `app/globals.css` tokens.
- If a component needs a local design-token alias, define it in that component's TSX `style` object with the filename prefix and map it directly to an existing global token, for example `"--empty-state-1-copy": "var(--muted-foreground)"`. Use the local alias only in a static Tailwind utility class.
- Do not use raw palette colors, arbitrary values, dynamic class strings, visual variant props, `<style>` elements, CSS imports, or component-specific CSS declarations. The only allowed inline style is a static local-token alias object validated by `rawComponents/local-token-aliases`. Do not pass props spreads from a custom component or block.
- Do not add other icon packages, decorative media, SVG layers, or presentation-only wrappers to custom components or blocks. Use only `*Icon` exports from the configured `lucide-react` library when an icon is needed.
- Keep `app/globals.css` limited to Tailwind/shadcn imports, the existing `@theme inline` token map, existing `:root` and `.dark` tokens, and approved token-based base typography rules. Do not add component token names or selectors there. New local aliases belong in their dedicated TSX file and must point to an existing global token.
- `shadcn/no-restyle` allows only layout, spacing, typography, and semantic token colors. Other shadcn lint rules reject arbitrary values, raw colors, unknown classes, and dynamic class strings. A narrow exception allows typed Tailwind classes that reference a validated local token alias.
- The existing primitive source files listed in `eslint.config.mjs` are upstream foundations. Keep their source appearance intact. New composition files in `registry/ui/` are linted with the same raw rules as blocks.
- Add an exact-file lint exception for another primitive only when its source is copied unchanged from the official shadcn registry. Never exempt a directory or a custom composition.
- Run `npm run lint` after changing UI or block source. Run `npm run check:design-system-css` and `npm run test:design-system` when changing design tokens or style rules. GitHub CI and the Codex PostToolUse hook check registry dependencies, registry structure, shadcn lint, local-token aliases, and global CSS. The Stop hook also runs registry and design-system tests. Do not disable lint rules to silence a finding.



# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
