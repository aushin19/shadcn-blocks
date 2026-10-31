import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const inputChunks = []

for await (const chunk of process.stdin) {
  inputChunks.push(chunk)
}

let hookEventName

try {
  hookEventName = JSON.parse(Buffer.concat(inputChunks).toString("utf8")).hook_event_name
} catch {
  process.stderr.write("Codex registry hook received invalid event JSON.\n")
  process.exit(2)
}

function runNode(name, args) {
  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    encoding: "utf8",
    windowsHide: true,
  })

  return {
    name,
    ok: result.status === 0,
    output: [result.stdout, result.stderr, result.error?.message]
      .filter(Boolean)
      .join("\n")
      .trim(),
  }
}

const checks = [
  runNode("Registry folder check", [path.join(projectRoot, "scripts", "check-registry-structure.mjs")]),
  runNode("Design system CSS check", [path.join(projectRoot, "scripts", "check-design-system-css.mjs")]),
  runNode("shadcn and local token lint", [path.join(projectRoot, "node_modules", "eslint", "bin", "eslint.js"), ".", "--max-warnings=0"]),
  runNode("Raw component stylesheet check", [path.join(projectRoot, "scripts", "check-raw-component-styles.mjs")]),
]

if (hookEventName === "Stop") {
  checks.push(
    runNode("Registry structure tests", ["--test", path.join(projectRoot, "tests", "registry-structure.test.mjs")]),
    runNode("Design system CSS and local token tests", [
      "--test",
      path.join(projectRoot, "tests", "design-system-css.test.mjs"),
      path.join(projectRoot, "tests", "local-token-aliases.test.mjs"),
    ]),
  )
}

const failures = checks.filter((check) => !check.ok)

if (failures.length > 0) {
  const reason = `Project checks failed. Keep UI sources in registry/ui/ and block implementations in registry/blocks/. Use only local shadcn components and existing design tokens, then fix all CSS and lint findings.\n${failures.map((failure) => `${failure.name} failed:\n${failure.output}`).join("\n\n")}`

  if (hookEventName === "Stop") {
    process.stdout.write(JSON.stringify({ decision: "block", reason }))
  } else {
    process.stderr.write(`${reason}\n`)
    process.exitCode = 2
  }
} else if (hookEventName === "Stop") {
  process.stdout.write(JSON.stringify({ continue: true }))
}
