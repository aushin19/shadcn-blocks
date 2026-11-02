import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const registryPath = path.join(root, "registry.json")
const outputPath = path.join(root, "lib", "registry-showcase-manifest.ts")
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"))

function toTitle(value) {
  return value
    .replace(/\.tsx?$/i, "")
    .split(/[-_/]+/)
    .filter(Boolean)
    .map((part) => (part.match(/^\d+$/) ? part : part[0].toUpperCase() + part.slice(1)))
    .join(" ")
}

function toCategory(relativePath, kind) {
  const pathParts = relativePath.split("/")
  const fileName = pathParts.at(-1).replace(/\.tsx?$/i, "")

  if (kind === "composition") {
    return pathParts.length > 1 ? toTitle(pathParts.at(-2)) : "Compositions"
  }

  const words = fileName.split("-")
  if (/^\d+$/.test(words.at(-1))) words.pop()
  return toTitle(words.join("-")) || "Blocks"
}

function listTsxFiles(directory, baseDirectory = directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) return listTsxFiles(absolutePath, baseDirectory)
    if (!entry.isFile() || !entry.name.endsWith(".tsx")) return []

    return [{
      absolutePath,
      relativePath: path.relative(root, absolutePath).split(path.sep).join("/"),
      itemPath: path.relative(baseDirectory, absolutePath).split(path.sep).join("/"),
    }]
  })
}

function getExportInfo(filePath) {
  const text = fs.readFileSync(filePath, "utf8")
  const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const names = []
  let hasDefault = false

  for (const statement of sourceFile.statements) {
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) ?? [] : []
    const isExported = modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    const isDefault = modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)

    if (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) {
      if (isExported && isDefault) hasDefault = true
      else if (isExported && statement.name) names.push(statement.name.text)
      continue
    }

    if (ts.isVariableStatement(statement) && isExported) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text)
      }
      continue
    }

    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const specifier of statement.exportClause.elements) {
        if (specifier.name.text === "default") hasDefault = true
        else names.push(specifier.name.text)
      }
      continue
    }

    if (ts.isExportAssignment(statement)) hasDefault = true
  }

  return { names, hasDefault }
}

function normalize(value) {
  return value.replace(/[^a-z\d]/gi, "").toLowerCase()
}

function pickPreviewExport(filePath, itemPath) {
  const { names, hasDefault } = getExportInfo(filePath)
  const baseName = path.basename(itemPath, path.extname(itemPath))
  const normalizedBase = normalize(baseName)
  const exactMatch = names.find((name) => normalize(name) === normalizedBase)
  if (exactMatch) return exactMatch

  const firstComponentExport = names.find((name) => /^[A-Z]/.test(name) && !/(Variants|Tokens)$/.test(name))
  if (firstComponentExport) return firstComponentExport
  if (hasDefault) return "default"
  return null
}

function findRegistryMetadata(relativePath) {
  for (const item of registry.items ?? []) {
    for (const file of item.files ?? []) {
      if (file.path === relativePath) return item
    }
  }
  return null
}

function readEntries(folder, kind) {
  const directory = path.join(root, folder)
  if (!fs.existsSync(directory)) return []

  return listTsxFiles(directory).map((file) => {
    const metadata = findRegistryMetadata(file.relativePath)
    const baseName = path.basename(file.itemPath, path.extname(file.itemPath))
    const previewExport = pickPreviewExport(file.absolutePath, file.itemPath)

    return {
      id: `${kind}:${file.itemPath.replace(/\.tsx$/i, "")}`,
      name: metadata?.title ?? toTitle(baseName),
      description:
        metadata?.description ??
        (kind === "block" ? "Block component from registry/blocks." : "UI component from registry/ui."),
      category: toCategory(file.itemPath, kind),
      file: file.relativePath,
      kind,
      importPath: `../${file.relativePath.replace(/\.tsx$/i, "")}`,
      previewExport,
    }
  })
}

const entries = [
  ...readEntries("registry/blocks", "block"),
  ...readEntries("registry/ui", "composition"),
].sort((left, right) => left.file.localeCompare(right.file))

const imports = []
const entrySource = entries.map((entry, index) => {
  let previewSource = "null"

  if (entry.previewExport) {
    const previewName = `RegistryPreview${index}`
    if (entry.previewExport === "default") {
      imports.push(`import ${previewName} from ${JSON.stringify(entry.importPath)}`)
    } else {
      imports.push(`import { ${entry.previewExport} as ${previewName} } from ${JSON.stringify(entry.importPath)}`)
    }
    previewSource = `${previewName} as unknown as RegistryShowcaseEntry["Preview"]`
  }

  return `  {\n    id: ${JSON.stringify(entry.id)},\n    name: ${JSON.stringify(entry.name)},\n    description: ${JSON.stringify(entry.description)},\n    category: ${JSON.stringify(entry.category)},\n    file: ${JSON.stringify(entry.file)},\n    kind: ${JSON.stringify(entry.kind)},\n    Preview: ${previewSource},\n  }`
})

const source = [
  'import type { ComponentType, ReactNode } from "react"',
  ...imports,
  "",
  "export type RegistryShowcaseEntry = {",
  "  id: string",
  "  name: string",
  "  description: string",
  "  category: string",
  "  file: string",
  '  kind: "block" | "composition"',
  "  Preview: ComponentType<{ children?: ReactNode }> | null",
  "}",
  "",
  "export const registryShowcaseEntries: RegistryShowcaseEntry[] = [",
  entrySource.join(",\n"),
  "]",
  "",
].join("\n")

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== source) {
  fs.writeFileSync(outputPath, source, "utf8")
}
