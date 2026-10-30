# shadcn-blocks

A GitHub-hosted shadcn/ui registry built with Next.js, Base UI, and Tailwind CSS
v4. The homepage previews the registry items. The shadcn CLI fetches item
definitions and source files directly from this public GitHub repository.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000 to preview the items. Registry JSON for the preview is
generated automatically before `npm run dev` and `npm run build`. GitHub installs
read the root `registry.json` and source files directly, so no registry server or
generated JSON needs to be hosted.

| Endpoint | Purpose |
| --- | --- |
| `/r/registry.json` | Generated catalog for the optional website preview |
| `/r/button.json` | Generated button payload for the optional website preview |
| `/r/call-to-action.json` | Generated block payload for the optional website preview |

## Install from this registry

After this repository is public on GitHub, run these from a separate project
initialized with shadcn/ui and Tailwind CSS v4:

```bash
npx shadcn@latest list aushin19/shadcn-blocks
npx shadcn@latest search aushin19/shadcn-blocks --query button
npx shadcn@latest view aushin19/shadcn-blocks/call-to-action
npx shadcn@latest add aushin19/shadcn-blocks/button
npx shadcn@latest add aushin19/shadcn-blocks/call-to-action
```

GitHub installs do not need a registry URL in `components.json`. The CLI uses
the consuming project's aliases to place files and rewrite imports. The block
bundles this registry's button so its Base UI API does not depend on the
consumer's selected shadcn style. Review the CLI prompt if the consuming project
already has a customized `button.tsx`.

Use the installed block:

```tsx
import { CallToAction } from "@/components/call-to-action"

export default function Page() {
  return (
    <CallToAction
      title="Start your next project"
      description="Reusable components, ready to customize."
      actionLabel="Read the docs"
      href="/docs"
    />
  )
}
```

Pin installs to a Git tag or commit when you want a fixed version:

```bash
npx shadcn@latest add aushin19/shadcn-blocks/call-to-action#v1.0.0
```

## Add your own items

1. Add UI primitive source files to `registry/ui/` and block implementation source files to `registry/blocks/`.
2. Add an item to the root `registry.json`, listing every source file and npm
   dependency it needs.
3. Use `registry:ui` for primitives and `registry:block` for blocks. Files inside
   a block can use `registry:component`, `registry:ui`, or other supported types.
4. Use `registryDependencies` for other registry items. Bare names such as
   `button` resolve to the official shadcn registry. To depend on your own item,
   use its full GitHub item address, such as
   `aushin19/shadcn-blocks/button`. Alternatively, bundle shared source files,
   as `call-to-action` does.
5. Run `npm run check:registry-structure`, `npm run test:registry`, and
   `npm run registry:build` after edits, including while the dev server is
   running. The registry build validates the manifest and regenerates
   `public/r/*.json`.
6. Add a preview to `app/page.tsx` if desired. Catalog metadata is read directly
   from `registry.json`; previews are explicitly imported.

Source files are the source of truth. Do not edit generated `public/r` files.
They are ignored by Git and recreated by the dev and production build scripts.
Items use the consuming project's semantic theme tokens; installing an item
does not replace its global theme.

## GitHub registry

This public registry is hosted at
[github.com/aushin19/shadcn-blocks](https://github.com/aushin19/shadcn-blocks).
GitHub hosts the manifest and source files, and the shadcn CLI fetches them from
there.

Validate locally and from GitHub:

```bash
npm run registry:validate
npx shadcn@latest registry validate aushin19/shadcn-blocks
```

No API route, database, registry server, npm publishing, or GitHub Pages setup is
required for CLI installs. The Next.js preview can be deployed separately if you
want a browsable website.

## Local CI and Codex hooks

Run the same checks as GitHub Actions locally:

```bash
npm run ci:local
```

The registry structure checker ensures UI source stays under `registry/ui/`,
block implementation source stays under `registry/blocks/`, and all source files
are listed in `registry.json`. Unit tests cover valid paths, invalid paths,
missing files, and unregistered source files. GitHub Actions runs
`npm run ci:local` on pushes and pull requests.

Project hooks in `.codex/hooks.json` check registry structure after file edits
and run the structure tests before Codex ends a turn. Review and trust the hooks
with `/hooks` before relying on them.

## Other checks

```bash
npm run registry:validate
npm run check:registry-structure
npm run test:registry
npm run lint
npm run typecheck
npm run build
```

## Official references

- [Registry getting started](https://ui.shadcn.com/docs/registry/getting-started)
- [Registry catalog schema](https://ui.shadcn.com/docs/registry/registry-json)
- [Registry item schema](https://ui.shadcn.com/docs/registry/registry-item-json)
- [Registry namespaces](https://ui.shadcn.com/docs/registry/namespace)
- [GitHub registries](https://ui.shadcn.com/docs/registry/github)
