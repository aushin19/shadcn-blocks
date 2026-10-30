import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { validateRegistryStructure } from "./registry-structure.mjs"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const registryPath = path.join(projectRoot, "registry.json")
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"])

function collectSourceFiles(directoryPath) {
  if (!existsSync(directoryPath)) {
    return []
  }

  return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      return collectSourceFiles(absolutePath)
    }

    if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) {
      return [path.relative(projectRoot, absolutePath).split(path.sep).join("/")]
    }

    return []
  })
}

let registry

try {
  registry = JSON.parse(readFileSync(registryPath, "utf8"))
} catch (error) {
  console.error(`Could not read registry.json: ${error.message}`)
  process.exit(1)
}

const sourceFiles = [
  ...collectSourceFiles(path.join(projectRoot, "registry", "ui")),
  ...collectSourceFiles(path.join(projectRoot, "registry", "blocks")),
]
const legacyUiSourceFiles = collectSourceFiles(path.join(projectRoot, "components", "ui"))
const errors = validateRegistryStructure(registry, {
  fileExists: (filePath) => existsSync(path.join(projectRoot, ...filePath.split("/"))),
  sourceFiles,
  legacyUiSourceFiles,
})

if (errors.length > 0) {
  console.error("Registry structure check failed:")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`Registry structure check passed for ${sourceFiles.length} source files.`)
