import { readFileSync } from "node:fs"
import { isDeepStrictEqual } from "node:util"
import parser from "@typescript-eslint/parser"

const frameworkPeerPackages = new Set(["react", "react-dom"])

function packageNameFromImport(source) {
  if (source.startsWith("@")) {
    const segments = source.split("/")
    return segments.length >= 2 ? `${segments[0]}/${segments[1]}` : source
  }
  return source.split("/")[0]
}

function dependencyMatches(dependencies, packageName) {
  return dependencies.some(
    (dependency) => dependency === packageName || dependency.startsWith(`${packageName}@`)
  )
}

function registryItemName(reference) {
  const withoutTag = reference.split("#")[0]

  if (/^https?:\/\//.test(withoutTag)) {
    const pathname = new URL(withoutTag).pathname
    return pathname.split("/").filter(Boolean).at(-1)?.replace(/\.json$/, "") ?? ""
  }

  return withoutTag.split("/").filter(Boolean).at(-1) ?? ""
}

function isApprovedRegistryDependency(reference, policy) {
  if (/^[a-z0-9][a-z0-9-]*$/.test(reference) || reference.startsWith("@shadcn/")) {
    return true
  }

  if (reference.startsWith(`${policy.selfRegistry}/`)) {
    const itemName = registryItemName(reference)
    return policy.registryItemNames.includes(itemName)
  }

  return policy.approvedExternalItems.includes(reference)
}

function validateExternalDependencies(item, policy, errors) {
  for (const dependency of item.registryDependencies ?? []) {
    if (!isApprovedRegistryDependency(dependency, policy)) {
      errors.push(
        `${item.name}: registry dependency "${dependency}" is not approved. Add the exact item to registry-policy.json only after it is selected.`
      )
    }
  }
}

function validateSourceImports(item, file, source, policy, errors) {
  let ast
  try {
    ast = parser.parse(source, {
      sourceType: "module",
      ecmaVersion: "latest",
      ecmaFeatures: { jsx: true },
    })
  } catch (error) {
    errors.push(`${item.name}: could not parse ${file.path}: ${error.message}`)
    return
  }

  const registryDependencies = item.registryDependencies ?? []
  const npmDependencies = [...(item.dependencies ?? []), ...(item.devDependencies ?? [])]

  for (const declaration of ast.body) {
    if (declaration.type !== "ImportDeclaration" || typeof declaration.source.value !== "string") {
      continue
    }

    const moduleSource = declaration.source.value
    const uiPrefix = "@/components/ui/"
    if (moduleSource.startsWith(uiPrefix)) {
      const uiItemName = moduleSource.slice(uiPrefix.length).split("/").at(-1).replace(/\.[^.]+$/, "")
      if (!registryDependencies.some((reference) => registryItemName(reference) === uiItemName)) {
        errors.push(
          `${item.name}: UI import "${moduleSource}" is missing a matching registryDependencies entry.`
        )
      }
      continue
    }

    if (
      moduleSource.startsWith("@/") ||
      moduleSource.startsWith("./") ||
      moduleSource.startsWith("../") ||
      moduleSource.startsWith("node:")
    ) {
      continue
    }

    const packageName = packageNameFromImport(moduleSource)
    if (frameworkPeerPackages.has(packageName)) {
      continue
    }

    if (!dependencyMatches(npmDependencies, packageName)) {
      errors.push(
        `${item.name}: npm import "${packageName}" must be listed in the registry item's dependencies.`
      )
    }
  }
}

export function findRegistryDependencyViolations(registry, policy, readSource = (filePath) => readFileSync(filePath, "utf8")) {
  const errors = []
  const itemNames = new Set(registry.items.map((item) => item.name))
  const resolvedPolicy = {
    ...policy,
    registryItemNames: [...itemNames],
    approvedExternalItems: policy.approvedExternalItems ?? [],
  }
  const baseItem = registry.items.find((item) => item.name === "base" && item.type === "registry:base")

  if (!baseItem) {
    errors.push("The registry must contain its shared registry:base item named \"base\".")
  }

  for (const item of registry.items) {
    if (item.type !== "registry:ui" && item.type !== "registry:block") {
      continue
    }

    if (!item.registryDependencies?.includes(resolvedPolicy.baseItem)) {
      errors.push(`${item.name}: include the shared design system dependency "${resolvedPolicy.baseItem}".`)
    }
    if (baseItem && !isDeepStrictEqual(item.cssVars, baseItem.cssVars)) {
      errors.push(`${item.name}: copy the shared base cssVars exactly so a single add command applies the design system.`)
    }

    validateExternalDependencies(item, resolvedPolicy, errors)

    for (const file of item.files ?? []) {
      const source = file.content ?? readSource(file.path)
      validateSourceImports(item, file, source, resolvedPolicy, errors)
    }
  }

  for (const dependency of baseItem?.registryDependencies ?? []) {
    if (!isApprovedRegistryDependency(dependency, resolvedPolicy)) {
      errors.push(
        `base: registry dependency "${dependency}" is not approved. Add the exact item to registry-policy.json only after it is selected.`
      )
    }
  }

  return errors
}
