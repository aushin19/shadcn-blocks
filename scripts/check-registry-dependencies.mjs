import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { findRegistryDependencyViolations } from "./registry-dependencies.mjs"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const registry = JSON.parse(readFileSync(path.join(projectRoot, "registry.json"), "utf8"))
const policy = JSON.parse(readFileSync(path.join(projectRoot, "registry-policy.json"), "utf8"))
const componentsConfig = JSON.parse(readFileSync(path.join(projectRoot, "components.json"), "utf8"))
const violations = findRegistryDependencyViolations(registry, policy, (filePath) =>
  readFileSync(path.join(projectRoot, filePath), "utf8")
)
const baseItem = registry.items.find((item) => item.name === "base" && item.type === "registry:base")

for (const dependency of policy.requiredBaseDependencies ?? []) {
  if (!baseItem?.dependencies?.includes(dependency)) {
    violations.push(`base: add required npm dependency "${dependency}" to the shared design system.`)
  }
}

for (const dependency of policy.requiredBaseRegistryDependencies ?? []) {
  if (!baseItem?.registryDependencies?.includes(dependency)) {
    violations.push(`base: add required registry dependency "${dependency}" to the shared design system.`)
  }
}

for (const [namespace, url] of Object.entries(policy.externalRegistries ?? {})) {
  if (componentsConfig.registries?.[namespace] !== url) {
    violations.push(`components.json: configure ${namespace} as "${url}".`)
  }
  if (baseItem?.config?.registries?.[namespace] !== url) {
    violations.push(`base: configure ${namespace} as "${url}" for consumer projects.`)
  }
}

for (const [key, expected] of Object.entries(policy.designSystem ?? {})) {
  if (baseItem?.config?.[key] !== expected) {
    violations.push(`base: set config.${key} to "${expected}".`)
  }
  if (componentsConfig[key] !== expected) {
    violations.push(`components.json: set ${key} to "${expected}".`)
  }
}

if (violations.length > 0) {
  console.error("Registry dependency check failed:")
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log("Registry dependencies passed. Every UI package and npm import is declared.")
