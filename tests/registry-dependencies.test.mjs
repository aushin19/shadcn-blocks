import assert from "node:assert/strict"
import test from "node:test"

import { findRegistryDependencyViolations } from "../scripts/registry-dependencies.mjs"

const sourcePath = "registry/blocks/example.tsx"
const policy = {
  selfRegistry: "aushin19/shadcn-blocks",
  baseItem: "aushin19/shadcn-blocks/base",
  approvedExternalItems: [],
}

function registry({ registryDependencies, dependencies } = {}) {
  return {
    items: [
      { name: "base", type: "registry:base", registryDependencies: ["utils"] },
      {
        name: "example",
        type: "registry:block",
        registryDependencies: registryDependencies ?? ["aushin19/shadcn-blocks/base", "button"],
        dependencies: dependencies ?? ["lucide-react"],
        files: [{ path: sourcePath, type: "registry:component" }],
      },
    ],
  }
}

const source = `
import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"
import type { ReactNode } from "react"
`

function check(registryItem, itemSource = source, itemPolicy = policy) {
  return findRegistryDependencyViolations(registryItem, itemPolicy, () => itemSource)
}

test("accepts declared UI, npm, and shared base dependencies", () => {
  assert.deepEqual(check(registry()), [])
})

test("requires the shared design system dependency", () => {
  const errors = check(registry({ registryDependencies: ["button"] }))

  assert.ok(errors.some((error) => error.includes("include the shared design system dependency")))
})

test("requires a registry dependency for every local UI import", () => {
  const errors = check(registry(), `import { Card } from "@/components/ui/card"`)

  assert.ok(errors.some((error) => error.includes("missing a matching registryDependencies entry")))
})

test("requires each directly imported npm package", () => {
  const errors = check(registry({ dependencies: [] }))

  assert.ok(errors.some((error) => error.includes('npm import "lucide-react"')))
})

test("requires exact approval for external registry items", () => {
  const errors = check(registry({
    registryDependencies: ["aushin19/shadcn-blocks/base", "button", "@reui/data-table"],
  }))

  assert.ok(errors.some((error) => error.includes('registry dependency "@reui/data-table" is not approved')))
})

test("accepts a user-approved external registry item", () => {
  const externalItem = "@reui/data-table"
  const errors = check(
    registry({ registryDependencies: ["aushin19/shadcn-blocks/base", "button", externalItem] }),
    source,
    { ...policy, approvedExternalItems: [externalItem] }
  )

  assert.deepEqual(errors, [])
})
