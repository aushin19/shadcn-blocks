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

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    encoding: "utf8",
    windowsHide: true,
  })

  return {
    ok: result.status === 0,
    output: [result.stdout, result.stderr, result.error?.message]
      .filter(Boolean)
      .join("\n")
      .trim(),
  }
}

const checks = [runNode([path.join(projectRoot, "scripts", "check-registry-structure.mjs")])]

if (hookEventName === "Stop") {
  checks.push(runNode(["--test", path.join(projectRoot, "tests", "registry-structure.test.mjs")]))
}

const failures = checks.filter((check) => !check.ok)

if (failures.length > 0) {
  const reason = `Registry folder checks failed. Keep UI sources in registry/ui/ and block implementations in registry/blocks/.\n${failures.map((failure) => failure.output).join("\n")}`

  if (hookEventName === "Stop") {
    process.stdout.write(JSON.stringify({ decision: "block", reason }))
  } else {
    process.stderr.write(`${reason}\n`)
    process.exitCode = 2
  }
} else if (hookEventName === "Stop") {
  process.stdout.write(JSON.stringify({ continue: true }))
}
