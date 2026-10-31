import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import postcss from "postcss"

import { approvedGlobalTokenNames } from "./design-system-token-names.mjs"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const stylesheetPath = path.join(projectRoot, "app", "globals.css")
const allowedImports = new Set([
  '"tailwindcss"',
  '"tw-animate-css"',
  '"shadcn/tailwind.css"',
])
const allowedBaseUtilities = new Map([
  ["*", "border-border outline-ring/50"],
  ["body", "bg-background text-foreground"],
  ["html", "font-sans"],
])

function lineOf(node) {
  return node.source?.start?.line ?? 1
}

function addViolation(violations, node, message) {
  violations.push(`${lineOf(node)}: ${message}`)
}

function checkTokenDeclarations(container, violations, context) {
  container.each((node) => {
    if (node.type === "comment") {
      return
    }

    if (node.type !== "decl" || !/^--[a-z0-9-]+$/.test(node.prop) || !node.value.trim()) {
      addViolation(
        violations,
        node,
        `${context} may contain design-token custom properties only.`
      )
    } else if (!approvedGlobalTokenNames.has(node.prop)) {
      addViolation(
        violations,
        node,
        `${node.prop} is not an existing global token. Define new component token aliases in the dedicated TSX file.`
      )
    }
  })
}

function checkTokenRule(node, violations) {
  const selector = node.selector.trim()
  if (![":root", ".dark"].includes(selector)) {
    addViolation(violations, node, "Only :root and .dark token selectors are allowed.")
    return
  }

  checkTokenDeclarations(node, violations, selector)
}

function checkBaseLayer(node, violations) {
  node.each((child) => {
    if (child.type === "comment") {
      return
    }

    if (child.type !== "rule") {
      addViolation(violations, child, "@layer base may contain only approved token-based typography rules.")
      return
    }

    const selector = child.selector.trim()
    const expectedUtilities = allowedBaseUtilities.get(selector)
    if (!expectedUtilities) {
      addViolation(violations, child, `The selector "${selector}" is not allowed in @layer base.`)
      return
    }

    const applies = []
    child.each((declaration) => {
      if (declaration.type === "comment") {
        return
      }

      if (declaration.type === "atrule" && declaration.name === "apply") {
        applies.push(declaration.params.trim().replace(/\s+/g, " "))
      } else {
        addViolation(
          violations,
          declaration,
          `Use only the approved @apply utilities for "${selector}".`
        )
      }
    })

    if (applies.length !== 1 || applies[0] !== expectedUtilities) {
      addViolation(
        violations,
        child,
        `Use only "@apply ${expectedUtilities};" for the "${selector}" base rule.`
      )
    }
  })
}

export function findDesignSystemCssViolations(source) {
  const violations = []
  let root

  try {
    root = postcss.parse(source, { from: "app/globals.css" })
  } catch (error) {
    return [`${error.line ?? 1}: CSS could not be parsed: ${error.reason ?? error.message}`]
  }

  root.each((node) => {
    if (node.type === "comment") {
      return
    }

    if (node.type === "atrule") {
      if (node.name === "import") {
        if (!allowedImports.has(node.params.trim())) {
          addViolation(violations, node, `The import "${node.params.trim()}" is not allowed.`)
        }
      } else if (node.name === "custom-variant") {
        if (node.params.trim() !== "dark (&:is(.dark *))") {
          addViolation(violations, node, "Only the existing dark custom variant is allowed.")
        }
      } else if (node.name === "theme") {
        if (node.params.trim() !== "inline") {
          addViolation(violations, node, "Only the existing @theme inline token map is allowed.")
        } else {
          checkTokenDeclarations(node, violations, "@theme inline")
        }
      } else if (node.name === "layer" && node.params.trim() === "base") {
        checkBaseLayer(node, violations)
      } else {
        addViolation(violations, node, `The @${node.name} rule is not allowed in app/globals.css.`)
      }
      return
    }

    if (node.type === "rule") {
      checkTokenRule(node, violations)
      return
    }

    addViolation(violations, node, "Only token declarations and approved Tailwind directives are allowed.")
  })

  return violations
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = readFileSync(stylesheetPath, "utf8")
  const violations = findDesignSystemCssViolations(source)

  if (violations.length > 0) {
    console.error("Design system CSS check failed:")
    for (const violation of violations) {
      console.error(`- app/globals.css:${violation}`)
    }
    process.exit(1)
  }

  console.log("Design system CSS check passed. Only tokens and approved base typography rules are present.")
}
