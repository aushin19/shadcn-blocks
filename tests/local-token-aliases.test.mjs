import assert from "node:assert/strict"
import { test } from "node:test"

import { getLocalTokenAliasViolation } from "../scripts/local-token-aliases.mjs"

test("accepts a local alias to an existing global token", () => {
  assert.equal(
    getLocalTokenAliasViolation(
      "--data-import-empty-state-copy",
      "var(--muted-foreground)",
      "data-import-empty-state"
    ),
    null
  )
})

test("rejects local aliases without a component file prefix", () => {
  assert.match(
    getLocalTokenAliasViolation("--shared-copy", "var(--muted-foreground)", "data-import-empty-state"),
    /prefix/
  )
})

test("rejects raw CSS values", () => {
  assert.match(
    getLocalTokenAliasViolation("--data-import-empty-state-copy", "#71717a", "data-import-empty-state"),
    /var\(--global-token\)/
  )
})

test("rejects references to unknown global tokens", () => {
  assert.match(
    getLocalTokenAliasViolation(
      "--data-import-empty-state-copy",
      "var(--color-success)",
      "data-import-empty-state"
    ),
    /not an existing global design token/
  )
})
