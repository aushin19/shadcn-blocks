import type { ComponentType, ReactNode } from "react"
import { EmptyState1 as RegistryPreview0 } from "../registry/blocks/empty-state-1"
import { Stats1 as RegistryPreview1 } from "../registry/blocks/stats-1"
import { Stats2 as RegistryPreview2 } from "../registry/blocks/stats-2"
import { Stats3 as RegistryPreview3 } from "../registry/blocks/stats-3"
import { Frame as RegistryPreview4 } from "../registry/ui/frame"

export type RegistryShowcaseEntry = {
  id: string
  name: string
  description: string
  category: string
  file: string
  kind: "block" | "composition"
  Preview: ComponentType<{ children?: ReactNode }> | null
}

export const registryShowcaseEntries: RegistryShowcaseEntry[] = [
  {
    id: "block:empty-state-1",
    name: "Empty State 1",
    description: "A records empty state with source and CSV actions plus quick guide links.",
    category: "Empty State",
    file: "registry/blocks/empty-state-1.tsx",
    kind: "block",
    Preview: RegistryPreview0 as unknown as RegistryShowcaseEntry["Preview"],
  },
  {
    id: "block:stats-1",
    name: "Stats 1",
    description: "A compact commerce metrics row with month-over-month comparisons.",
    category: "Stats",
    file: "registry/blocks/stats-1.tsx",
    kind: "block",
    Preview: RegistryPreview1 as unknown as RegistryShowcaseEntry["Preview"],
  },
  {
    id: "block:stats-2",
    name: "Stats 2",
    description: "Four commerce metrics grouped in one shared frame.",
    category: "Stats",
    file: "registry/blocks/stats-2.tsx",
    kind: "block",
    Preview: RegistryPreview2 as unknown as RegistryShowcaseEntry["Preview"],
  },
  {
    id: "block:stats-3",
    name: "Stats 3",
    description: "Four operational metrics for connection health, dataset links, row syncs, and failures.",
    category: "Stats",
    file: "registry/blocks/stats-3.tsx",
    kind: "block",
    Preview: RegistryPreview3 as unknown as RegistryShowcaseEntry["Preview"],
  },
  {
    id: "composition:frame",
    name: "Frame",
    description: "A compact surface composition for grouping related content.",
    category: "Compositions",
    file: "registry/ui/frame.tsx",
    kind: "composition",
    Preview: RegistryPreview4 as unknown as RegistryShowcaseEntry["Preview"],
  }
]
