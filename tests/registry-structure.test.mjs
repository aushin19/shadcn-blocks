import assert from "node:assert/strict"
import test from "node:test"

import { validateRegistryStructure } from "../scripts/registry-structure.mjs"

const uiFile = "registry/ui/button.tsx"
const blockFile = "registry/blocks/call-to-action.tsx"

function validRegistry() {
  return {
    items: [
      {
        name: "button",
        type: "registry:ui",
        files: [{ path: uiFile, type: "registry:ui" }],
      },
      {
        name: "call-to-action",
        type: "registry:block",
        files: [
          { path: blockFile, type: "registry:component" },
          { path: uiFile, type: "registry:ui" },
        ],
      },
    ],
  }
}

test("accepts UI and block sources in their required folders", () => {
  const registry = validRegistry()
  const errors = validateRegistryStructure(registry, {
    fileExists: () => true,
    sourceFiles: [uiFile, blockFile],
  })

  assert.deepEqual(errors, [])
})

test("accepts metadata-only base and font items", () => {
  const errors = validateRegistryStructure({
    items: [
      { name: "base", type: "registry:base", config: {}, cssVars: { light: {} } },
      {
        name: "font",
        type: "registry:font",
        font: { family: "Example", provider: "google", import: "Example", variable: "--font-sans" },
      },
    ],
  })

  assert.deepEqual(errors, [])
})

test("rejects duplicate registry item names", () => {
  const registry = validRegistry()
  registry.items[1].name = registry.items[0].name

  const errors = validateRegistryStructure(registry, { fileExists: () => true })

  assert.ok(errors.some((error) => error.includes("registry item names must be unique")))
})

test("rejects UI item source outside registry/ui", () => {
  const registry = validRegistry()
  registry.items[0].files[0].path = "components/ui/button.tsx"

  const errors = validateRegistryStructure(registry, { fileExists: () => true })

  assert.ok(errors.some((error) => error.includes("registry/ui/")))
})

test("rejects block implementation outside registry/blocks", () => {
  const registry = validRegistry()
  registry.items[1].files[0].path = "registry/ui/call-to-action.tsx"

  const errors = validateRegistryStructure(registry, { fileExists: () => true })

  assert.ok(errors.some((error) => error.includes("registry/blocks/")))
})

test("rejects bundled UI source outside registry/ui", () => {
  const registry = validRegistry()
  registry.items[1].files[1].path = "components/ui/button.tsx"

  const errors = validateRegistryStructure(registry, { fileExists: () => true })

  assert.ok(errors.some((error) => error.includes("registry/ui/")))
})

test("rejects missing registry sources", () => {
  const registry = validRegistry()
  const errors = validateRegistryStructure(registry, { fileExists: (filePath) => filePath !== uiFile })

  assert.ok(errors.some((error) => error.includes("source file does not exist")))
})

test("rejects source files that are not registered", () => {
  const registry = validRegistry()
  const errors = validateRegistryStructure(registry, {
    fileExists: () => true,
    sourceFiles: [uiFile, blockFile, "registry/ui/unused.tsx"],
  })

  assert.ok(errors.some((error) => error.includes("add this source file to the root registry.json")))
})

test("allows exact upstream shadcn files in the consumer UI folder", () => {
  const errors = validateRegistryStructure(validRegistry(), {
    legacyUiSourceFiles: ["components/ui/button.tsx"],
    allowedConsumerUiSourceFiles: ["components/ui/button.tsx"],
  })

  assert.deepEqual(errors, [])
})

test("rejects unlisted UI source files in the consumer UI folder", () => {
  const errors = validateRegistryStructure(validRegistry(), {
    legacyUiSourceFiles: ["components/ui/custom.tsx"],
    allowedConsumerUiSourceFiles: ["components/ui/button.tsx"],
  })

  assert.ok(errors.some((error) => error.includes("move registry UI source files to registry/ui/")))
})

test("rejects unsafe and non-normalized paths", () => {
  const registry = validRegistry()
  registry.items[0].files[0].path = "registry/ui/../blocks/button.tsx"

  const errors = validateRegistryStructure(registry, { fileExists: () => true })

  assert.ok(errors.some((error) => error.includes("safe relative path")))
})
