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

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

