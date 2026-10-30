import { Button } from "@/components/ui/button"
import { CallToAction } from "@/registry/blocks/call-to-action"
import registry from "@/registry.json"
import Link from "next/link"

const githubRepository = registry.homepage.replace("https://github.com/", "")

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh max-w-4xl flex-col gap-10 px-6 py-12 sm:py-20">
      <header className="space-y-4">
        <p className="text-sm font-medium text-primary">shadcn/ui registry</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Blocks and components you own.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse the previews and install the source into your project with the
          shadcn CLI. Built with Base UI and Tailwind CSS v4.
        </p>
        <nav aria-label="Registry resources" className="flex flex-wrap gap-4 text-sm">
          <Link className="underline underline-offset-4" href="/r/registry.json">
            Registry JSON
          </Link>
          <a
            className="underline underline-offset-4"
            href="https://ui.shadcn.com/docs/registry/getting-started"
          >
            Registry documentation
          </a>
          <span className="text-muted-foreground">Press D to toggle the theme</span>
        </nav>
      </header>

      <section aria-labelledby="install-heading" className="space-y-3">
        <h2 id="install-heading" className="text-lg font-semibold">
          Install a component
        </h2>
        <p className="text-sm text-muted-foreground">
          Run this in a project initialized with shadcn/ui. The CLI fetches the
          item and its source files directly from the public GitHub repository.
        </p>
        <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
          <code>{`npx shadcn@latest add ${githubRepository}/button`}</code>
        </pre>
      </section>

      <div className="space-y-8">
        {registry.items.map((item) => (
          <section
            key={item.name}
            className="space-y-4"
            aria-labelledby={`${item.name}-heading`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 id={`${item.name}-heading`} className="text-lg font-semibold">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Link
                className="shrink-0 text-sm underline underline-offset-4"
                href={`/r/${item.name}.json`}
              >
                View JSON
              </Link>
            </div>
            {item.name === "button" && (
              <div className="flex flex-wrap gap-3 rounded-xl border p-6">
                <Button
                  nativeButton={false}
                  render={<a href="https://ui.shadcn.com/docs/components/button" />}
                >
                  Button docs
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<a href="/r/button.json" />}
                >
                  View source
                </Button>
              </div>
            )}
            {item.name === "call-to-action" && (
              <CallToAction href="https://ui.shadcn.com/docs" />
            )}
            <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs sm:text-sm">
              <code>{`npx shadcn@latest add ${githubRepository}/${item.name}`}</code>
            </pre>
          </section>
        ))}
      </div>
    </main>
  )
}
