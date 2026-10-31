import { readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const allowedStylesheet = "app/globals.css"
const stylesheetExtensions = new Set([".css", ".less", ".sass", ".scss", ".styl"])
const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
])

function collectStylesheets(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      collectStylesheets(path.join(directory, entry.name), files)
      continue
    }

    if (entry.isFile() && stylesheetExtensions.has(path.extname(entry.name))) {
      files.push(path.relative(projectRoot, path.join(directory, entry.name)).split(path.sep).join("/"))
    }
  }

  return files
}

const stylesheets = collectStylesheets(projectRoot)
const violations = stylesheets.filter((filePath) => filePath !== allowedStylesheet)

if (violations.length > 0) {
  console.error("Raw component style check failed:")
  for (const filePath of violations) {
    console.error(
      `- ${filePath}:1:1 Stylesheets outside ${allowedStylesheet} are not allowed. Move approved styles into ${allowedStylesheet}.`
    )
  }
  process.exit(1)
}

console.log(`Raw component style check passed. ${allowedStylesheet} is the only stylesheet.`)
