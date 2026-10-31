import assert from "node:assert/strict"
import { test } from "node:test"

import { getLocalTokenAliasViolation } from "../scripts/local-token-aliases.mjs"

test("accepts a local alias to an existing global token", () => {
  assert.equal(
    getLocalTokenAliasViolation(
      "--empty-state-1-copy",
      "var(--muted-foreground)",
      "empty-state-1"
    ),
    null
  )
})

test("rejects local aliases without a component file prefix", () => {
  assert.match(
    getLocalTokenAliasViolation("--shared-copy", "var(--muted-foreground)", "empty-state-1"),
    /prefix/
  )
})

test("rejects raw CSS values", () => {
  assert.match(
    getLocalTokenAliasViolation("--empty-state-1-copy", "#71717a", "empty-state-1"),
    /var\(--global-token\)/
  )
})

test("rejects references to unknown global tokens", () => {
  assert.match(
    getLocalTokenAliasViolation(
      "--empty-state-1-copy",
      "var(--color-success)",
      "empty-state-1"
    ),
    /not an existing global design token/
  )
})
