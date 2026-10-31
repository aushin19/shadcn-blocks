import type { CSSProperties } from "react"
import {
  BookOpenIcon,
  ChevronRightIcon,
  FileTextIcon,
  PlugZapIcon,
  UploadIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const dataImportEmptyStateTokens = {
  canvas: "flex min-h-svh w-full items-start justify-center bg-card/60 p-4 sm:p-8 md:p-12",
  section:
    "mx-auto flex min-h-205 w-full max-w-3xl flex-col items-center justify-center gap-24 py-8 sm:gap-32 md:py-12",
  empty: "flex-none gap-7 p-0",
  header: "max-w-md gap-4",
  copy: "flex flex-col items-center gap-2",
  title: "text-2xl font-semibold tracking-tight",
  description: "max-w-sm text-sm/relaxed",
  illustration: "relative h-24 w-52 mb-0",
  illustrationBackFirst:
    "absolute left-1/2 top-0 h-12 w-40 -translate-x-1/2 bg-card/50",
  illustrationBackSecond:
    "absolute left-1/2 top-3 h-12 w-44 -translate-x-1/2 bg-card/50",
  illustrationFront:
    "absolute left-1/2 top-6 z-10 flex h-18 w-52 -translate-x-1/2 justify-center bg-card p-0",
  illustrationContent: "flex h-full items-center gap-3 p-4",
  illustrationIcon: "size-8 shrink-0 bg-muted p-0",
  illustrationLines: "flex flex-col gap-2",
  illustrationPrimaryLine: "h-2 w-24 bg-muted p-0",
  illustrationSecondaryLine: "h-2 w-16 bg-muted p-0",
  actions: "max-w-none flex-row justify-center gap-2",
  primaryAction:
    "bg-foreground/90 px-3 text-background hover:bg-foreground/90",
  secondaryAction:
    "border-border bg-foreground/5 pr-3 text-foreground hover:bg-foreground/10",
  guideList: "mx-auto w-full max-w-136 space-y-3",
  guideLabel: "text-sm text-(color:--empty-state-1-copy)",
  guideGrid: "grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2",
  guideItem: "min-w-0 border-border",
  guideMedia: "size-4 text-muted-foreground",
  guideIcon: "size-4",
  guideContent: "min-w-0",
  guideTitle: "truncate",
  guideActions: "text-muted-foreground",
} as const

export function EmptyState1() {
  return (
    <main
      className={dataImportEmptyStateTokens.canvas}
      style={{ "--empty-state-1-copy": "var(--muted-foreground)" } as CSSProperties}
    >
      <section className={dataImportEmptyStateTokens.section}>
        <Empty className={dataImportEmptyStateTokens.empty}>
          <EmptyHeader className={dataImportEmptyStateTokens.header}>
            <EmptyMedia
              aria-hidden="true"
              className={dataImportEmptyStateTokens.illustration}
            >
              <Card
                className={dataImportEmptyStateTokens.illustrationBackFirst}
              />
              <Card
                className={dataImportEmptyStateTokens.illustrationBackSecond}
              />
              <Card className={dataImportEmptyStateTokens.illustrationFront}>
                <CardContent className={dataImportEmptyStateTokens.illustrationContent}>
                  <ItemMedia
                    aria-hidden="true"
                    className={dataImportEmptyStateTokens.illustrationIcon}
                  />
                  <div className={dataImportEmptyStateTokens.illustrationLines}>
                    <Card
                      aria-hidden="true"
                      className={dataImportEmptyStateTokens.illustrationPrimaryLine}
                    />
                    <Card
                      aria-hidden="true"
                      className={dataImportEmptyStateTokens.illustrationSecondaryLine}
                    />
                  </div>
                </CardContent>
              </Card>
            </EmptyMedia>

            <header className={dataImportEmptyStateTokens.copy}>
              <EmptyTitle className={dataImportEmptyStateTokens.title}>
                Your record space is empty
              </EmptyTitle>
              <EmptyDescription className={dataImportEmptyStateTokens.description}>
                Connect a live source or upload a CSV to start organizing people,
                teams, and attributes in one place.
              </EmptyDescription>
            </header>
          </EmptyHeader>

          <EmptyContent className={dataImportEmptyStateTokens.actions}>
            <Button
              className={dataImportEmptyStateTokens.primaryAction}
              nativeButton={false}
              render={<a href="#connect-source" />}
            >
              <PlugZapIcon aria-hidden="true" />
              Connect source
            </Button>
            <Button
              className={dataImportEmptyStateTokens.secondaryAction}
              nativeButton={false}
              render={<a href="#upload-csv" />}
            >
              <UploadIcon aria-hidden="true" />
              Upload CSV
            </Button>
          </EmptyContent>
        </Empty>

        <nav aria-label="Quick guides" className={dataImportEmptyStateTokens.guideList}>
          <p className={dataImportEmptyStateTokens.guideLabel}>Quick guides</p>
          <ul className={dataImportEmptyStateTokens.guideGrid}>
            <li>
              <Item
                className={dataImportEmptyStateTokens.guideItem}
                render={<a href="#how-records-work" />}
              >
                <ItemMedia className={dataImportEmptyStateTokens.guideMedia}>
                  <BookOpenIcon aria-hidden="true" className={dataImportEmptyStateTokens.guideIcon} />
                </ItemMedia>
                <ItemContent className={dataImportEmptyStateTokens.guideContent}>
                  <ItemTitle className={dataImportEmptyStateTokens.guideTitle}>
                    How records work
                  </ItemTitle>
                </ItemContent>
                <ItemActions className={dataImportEmptyStateTokens.guideActions}>
                  <ChevronRightIcon aria-hidden="true" className={dataImportEmptyStateTokens.guideIcon} />
                </ItemActions>
              </Item>
            </li>
            <li>
              <Item
                className={dataImportEmptyStateTokens.guideItem}
                render={<a href="#csv-setup" />}
              >
                <ItemMedia className={dataImportEmptyStateTokens.guideMedia}>
                  <FileTextIcon aria-hidden="true" className={dataImportEmptyStateTokens.guideIcon} />
                </ItemMedia>
                <ItemContent className={dataImportEmptyStateTokens.guideContent}>
                  <ItemTitle className={dataImportEmptyStateTokens.guideTitle}>
                    CSV setup
                  </ItemTitle>
                </ItemContent>
                <ItemActions className={dataImportEmptyStateTokens.guideActions}>
                  <ChevronRightIcon aria-hidden="true" className={dataImportEmptyStateTokens.guideIcon} />
                </ItemActions>
              </Item>
            </li>
          </ul>
        </nav>
      </section>
    </main>
  )
}
