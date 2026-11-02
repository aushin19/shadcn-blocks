import { spawn, spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const generatorPath = path.join(root, "scripts", "generate-showcase-manifest.mjs")
const nextPath = path.join(root, "node_modules", "next", "dist", "bin", "next")
const registryDirectories = [
  path.join(root, "registry", "blocks"),
  path.join(root, "registry", "ui"),
]

const initialGeneration = spawnSync(process.execPath, [generatorPath], {
  cwd: root,
  stdio: "inherit",
})

if (initialGeneration.status !== 0) {
  process.exit(initialGeneration.status ?? 1)
}

const next = spawn(process.execPath, [nextPath, "dev"], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
})

const watchers = []
let timer
let generationProcess
let rerunAfterGeneration = false
let stopping = false

function startGeneration() {
  if (generationProcess) {
    rerunAfterGeneration = true
    return
  }

  generationProcess = spawn(process.execPath, [generatorPath], {
    cwd: root,
    stdio: "inherit",
  })

  generationProcess.on("exit", (code) => {
    generationProcess = undefined
    if (code !== 0) {
      process.stderr.write("Showcase manifest generation failed.\n")
    }
    if (rerunAfterGeneration) {
      rerunAfterGeneration = false
      startGeneration()
    }
  })
}

function scheduleGeneration() {
  clearTimeout(timer)
  timer = setTimeout(startGeneration, 200)
}

for (const directory of registryDirectories) {
  if (!fs.existsSync(directory)) continue

  watchers.push(fs.watch(directory, { recursive: true }, (_eventType, fileName) => {
    if (!fileName || String(fileName).endsWith(".tsx")) scheduleGeneration()
  }))
}

watchers.push(fs.watch(path.join(root, "registry.json"), scheduleGeneration))

function closeWatchers() {
  clearTimeout(timer)
  for (const watcher of watchers) watcher.close()
}

function stop(signal) {
  if (stopping) return
  stopping = true
  closeWatchers()
  next.kill(signal)
  generationProcess?.kill(signal)
}

process.on("SIGINT", () => stop("SIGINT"))
process.on("SIGTERM", () => stop("SIGTERM"))

next.on("error", (error) => {
  process.stderr.write(`Could not start Next.js: ${error.message}\n`)
  closeWatchers()
  process.exitCode = 1
})

next.on("exit", (code, signal) => {
  closeWatchers()
  generationProcess?.kill("SIGTERM")
  process.exit(signal ? 1 : code ?? 0)
})
