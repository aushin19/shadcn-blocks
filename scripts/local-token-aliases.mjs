import { approvedGlobalTokenNames } from "./design-system-token-names.mjs"

export function getLocalTokenAliasViolation(tokenName, value, componentName) {
  const expectedPrefix = `--${componentName}-`
  if (
    typeof tokenName !== "string" ||
    !tokenName.startsWith(expectedPrefix) ||
    !/^--[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tokenName)
  ) {
    return `Name local CSS variables with the "${expectedPrefix}" prefix.`
  }

  if (typeof value !== "string") {
    return "Set local CSS variables to a static var(--global-token) reference."
  }

  const match = value.trim().match(/^var\((--[a-z0-9-]+)\)$/)
  if (!match) {
    return "Set local CSS variables to a static var(--global-token) reference."
  }

  if (!approvedGlobalTokenNames.has(match[1])) {
    return `"${match[1]}" is not an existing global design token.`
  }

  return null
}
