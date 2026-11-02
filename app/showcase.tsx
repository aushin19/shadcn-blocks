"use client"

import { Component, useState, type ReactNode } from "react"
import { SearchIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
  registryShowcaseEntries,
  type RegistryShowcaseEntry,
} from "@/lib/registry-showcase-manifest"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Section = "blocks" | "ui-components"

type PreviewBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
}

type PreviewBoundaryState = {
  hasError: boolean
}

class PreviewBoundary extends Component<PreviewBoundaryProps, PreviewBoundaryState> {
  state: PreviewBoundaryState = { hasError: false }

  static getDerivedStateFromError(): PreviewBoundaryState {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

const sectionCopy: Record<Section, { title: string; description: string }> = {
  blocks: {
    title: "Blocks",
    description: "Ready-to-use compositions from registry/blocks.",
  },
  "ui-components": {
    title: "UI Components",
    description: "Reusable components from registry/ui.",
  },
}

function ComponentSample({ entry }: { entry: RegistryShowcaseEntry }) {
  const Preview = entry.Preview
  const fallback = (
    <div className="flex flex-col gap-2 text-center">
      <p className="text-sm text-muted-foreground">Preview needs component-specific props.</p>
      <code className="font-mono text-xs text-muted-foreground">{entry.file}</code>
    </div>
  )

  if (!Preview) return fallback

  return (
    <PreviewBoundary fallback={fallback}>
      {entry.kind === "block" ? (
        <Preview />
      ) : (
        <Preview>
          <p className="text-sm text-muted-foreground">{entry.name} preview</p>
        </Preview>
      )}
    </PreviewBoundary>
  )
}

function CatalogCard({ entry }: { entry: RegistryShowcaseEntry }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-1">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{entry.name}</CardTitle>
          <Badge className="bg-muted text-muted-foreground">UI Component</Badge>
        </div>
        <CardDescription>{entry.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-36 items-center justify-center p-4">
        <ComponentSample entry={entry} />
      </CardContent>
      <footer className="px-4 py-3">
        <code className="font-mono text-xs text-muted-foreground">{entry.file}</code>
      </footer>
    </Card>
  )
}

function BlockCard({ entry }: { entry: RegistryShowcaseEntry }) {
  return (
    <article className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{entry.name}</h2>
          <p className="text-sm text-muted-foreground">{entry.description}</p>
        </div>
        <Badge className="bg-muted text-muted-foreground">{entry.category}</Badge>
      </header>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <ComponentSample entry={entry} />
        </CardContent>
      </Card>
      <p className="font-mono text-xs text-muted-foreground">{entry.file}</p>
    </article>
  )
}

function CategoryButton({
  children,
  count,
  active,
  onClick,
}: {
  children: ReactNode
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <Button
      aria-current={active ? "page" : undefined}
      className="w-full justify-between bg-background text-muted-foreground hover:bg-muted data-[active]:bg-muted data-[active]:text-foreground"
      data-active={active ? "" : undefined}
      onClick={onClick}
    >
      <span>{children}</span>
      <span className="text-xs tabular-nums">{count}</span>
    </Button>
  )
}

export function RegistryShowcase() {
  const { resolvedTheme, setTheme } = useTheme()
  const [section, setSection] = useState<Section>("blocks")
  const [category, setCategory] = useState("All")
  const [query, setQuery] = useState("")
  const items = registryShowcaseEntries.filter((entry) =>
    section === "blocks" ? entry.kind === "block" : entry.kind === "composition"
  )
  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))]
  const selectedCategory = categories.includes(category) ? category : "All"
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const searchable = `${item.name} ${item.category} ${item.description} ${item.file}`
    return matchesCategory && searchable.toLowerCase().includes(query.toLowerCase())
  })
  const copy = sectionCopy[section]

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/95">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight">PsyberQ</span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground">shadcn-blocks</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Tabs
              value={section}
              onValueChange={(value) =>
                setSection(value === "ui-components" ? "ui-components" : "blocks")
              }
            >
              <TabsList>
                <TabsTrigger value="blocks" className="px-3">Blocks</TabsTrigger>
                <TabsTrigger value="ui-components" className="px-3">UI Components</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Dark mode</span>
              <Switch
                aria-label="Dark mode"
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
            <label className="relative block w-52">
              <SearchIcon aria-hidden="true" className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search the catalog"
                className="pl-8"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                value={query}
              />
            </label>
          </div>
        </div>
      </header>

      <main className="grid min-h-svh grid-cols-1 lg:grid-cols-12">
        <aside className="border-b p-4 lg:col-span-2 lg:border-r lg:border-b-0 lg:p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Categories</h2>
            <Badge className="bg-muted text-muted-foreground">{items.length}</Badge>
          </div>
          <nav aria-label="Catalog categories" className="space-y-1">
            <CategoryButton
              active={selectedCategory === "All"}
              count={items.length}
              onClick={() => setCategory("All")}
            >
              All {section === "blocks" ? "Blocks" : "UI Components"}
            </CategoryButton>
            {categories.slice(1).map((itemCategory) => (
              <CategoryButton
                key={itemCategory}
                active={selectedCategory === itemCategory}
                count={items.filter((item) => item.category === itemCategory).length}
                onClick={() => setCategory(itemCategory)}
              >
                {itemCategory}
              </CategoryButton>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:col-span-10 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">PsyberQ / {copy.title}</p>
              <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">{copy.description}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} {section === "blocks" ? "block" : "component"}
              {filteredItems.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <p className="py-16 text-sm text-muted-foreground">No items match this search.</p>
          ) : section === "blocks" ? (
            <div className="space-y-8">
              {filteredItems.map((entry) => <BlockCard key={entry.id} entry={entry} />)}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((entry) => <CatalogCard key={entry.id} entry={entry} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
