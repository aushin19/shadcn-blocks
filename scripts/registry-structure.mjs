const UI_SOURCE_ROOT = "registry/ui"
const BLOCK_SOURCE_ROOT = "registry/blocks"

function isSafeRelativePath(filePath) {
  if (typeof filePath !== "string" || filePath.length === 0) {
    return false
  }

  if (filePath.includes("\\") || filePath.startsWith("/")) {
    return false
  }

  if (/^[A-Za-z]:/.test(filePath)) {
    return false
  }

  const segments = filePath.split("/")
  return !segments.some((segment) => segment === ".." || segment === "." || segment === "")
}

function isInsideRoot(filePath, sourceRoot) {
  return filePath.startsWith(`${sourceRoot}/`)
}

export function validateRegistryStructure(
  registry,
  {
    fileExists = () => true,
    sourceFiles = [],
    legacyUiSourceFiles = [],
    allowedConsumerUiSourceFiles = [],
  } = {}
) {
  const errors = []
  const registeredSourceFiles = new Set()
  const itemNames = new Set()
  const allowedConsumerUiSources = new Set(allowedConsumerUiSourceFiles)

  if (!registry || !Array.isArray(registry.items)) {
    return ["registry.json must contain an items array."]
  }

  for (const [itemIndex, item] of registry.items.entries()) {
    const itemLabel = `items[${itemIndex}] (${item?.name ?? "unnamed"})`
    if (typeof item?.name === "string" && itemNames.has(item.name)) {
      errors.push(`${itemLabel}: registry item names must be unique.`)
    }
    if (typeof item?.name === "string") {
      itemNames.add(item.name)
    }

    if (item?.type === "registry:base" || item?.type === "registry:font") {
      if (Array.isArray(item.files) && item.files.length > 0) {
        errors.push(`${itemLabel}: base and font registry items must not contain source files.`)
      }
      if (item.type === "registry:base" && !item.config) {
        errors.push(`${itemLabel}: a registry:base item must define its shadcn config.`)
      }
      if (
        item.type === "registry:font" &&
        (!item.font?.family || !item.font?.provider || !item.font?.import || !item.font?.variable)
      ) {
        errors.push(`${itemLabel}: a registry:font item must define its font metadata.`)
      }
      continue
    }

    if (item?.type !== "registry:ui" && item?.type !== "registry:block") {
      errors.push(`${itemLabel}: only registry:base, registry:font, registry:ui, and registry:block items are allowed.`)
      continue
    }

    if (!Array.isArray(item.files) || item.files.length === 0) {
      errors.push(`${itemLabel}: files must contain at least one source file.`)
      continue
    }

    let hasUiSource = false
    let hasBlockSource = false

    for (const [fileIndex, file] of item.files.entries()) {
      const fileLabel = `${itemLabel} files[${fileIndex}]`

      if (!isSafeRelativePath(file?.path)) {
        errors.push(`${fileLabel}: path must be a safe relative path using forward slashes.`)
        continue
      }

      const expectedRoot =
        file.type === "registry:ui"
          ? UI_SOURCE_ROOT
          : file.type === "registry:component" && item.type === "registry:block"
            ? BLOCK_SOURCE_ROOT
            : null

      if (!expectedRoot) {
        errors.push(
          `${fileLabel}: use registry:ui for ${UI_SOURCE_ROOT}/ files and registry:component for ${BLOCK_SOURCE_ROOT}/ block files.`
        )
        continue
      }

      if (!isInsideRoot(file.path, expectedRoot)) {
        errors.push(`${fileLabel}: ${file.type} source must be inside ${expectedRoot}/.`)
        continue
      }

      registeredSourceFiles.add(file.path)
      hasUiSource ||= file.type === "registry:ui"
      hasBlockSource ||= file.type === "registry:component"

      if (!fileExists(file.path)) {
        errors.push(`${fileLabel}: source file does not exist at ${file.path}.`)
      }
    }

    if (item.type === "registry:ui" && !hasUiSource) {
      errors.push(`${itemLabel}: a UI item must include a registry:ui file from ${UI_SOURCE_ROOT}/.`)
    }

    if (item.type === "registry:block" && !hasBlockSource) {
      errors.push(`${itemLabel}: a block must include a registry:component file from ${BLOCK_SOURCE_ROOT}/.`)
    }
  }

  for (const sourceFile of sourceFiles) {
    const isAllowedSource =
      isSafeRelativePath(sourceFile) &&
      (isInsideRoot(sourceFile, UI_SOURCE_ROOT) || isInsideRoot(sourceFile, BLOCK_SOURCE_ROOT))

    if (!isAllowedSource) {
      errors.push(`${sourceFile}: registry source files must live under ${UI_SOURCE_ROOT}/ or ${BLOCK_SOURCE_ROOT}/.`)
      continue
    }

    if (!registeredSourceFiles.has(sourceFile)) {
      errors.push(`${sourceFile}: add this source file to the root registry.json.`)
    }
  }

  for (const sourceFile of legacyUiSourceFiles) {
    if (!allowedConsumerUiSources.has(sourceFile)) {
      errors.push(`${sourceFile}: move registry UI source files to ${UI_SOURCE_ROOT}/.`)
    }
  }

  return errors
}

export { BLOCK_SOURCE_ROOT, UI_SOURCE_ROOT }
