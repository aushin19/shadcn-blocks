import {
  ArrowDownIcon,
  ArrowLeftRightIcon,
  ArrowUpIcon,
  LinkIcon,
  PlugZapIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Frame, FramePanel } from "@/components/reui/frame"
import { Badge } from "@/components/ui/badge"

type MetricIcon =
  | typeof PlugZapIcon
  | typeof LinkIcon
  | typeof ArrowLeftRightIcon
  | typeof TriangleAlertIcon

type Stats3Metric = {
  label: string
  period: string
  value: string
  suffix?: string
  delta: string
  direction: "up" | "down"
  tone: "success" | "destructive"
  comparison: string
  icon: MetricIcon
}

const metrics: Stats3Metric[] = [
  {
    label: "Connection Health",
    period: "Now",
    value: "10",
    suffix: "/13",
    delta: "2",
    direction: "down",
    tone: "destructive",
    comparison: "12 healthy yesterday",
    icon: PlugZapIcon,
  },
  {
    label: "Linked Datasets",
    period: "Now",
    value: "33",
    suffix: "/49",
    delta: "2",
    direction: "up",
    tone: "success",
    comparison: "31 linked last week",
    icon: LinkIcon,
  },
  {
    label: "Rows Synced",
    period: "14 days",
    value: "8.4M",
    delta: "4.4%",
    direction: "up",
    tone: "success",
    comparison: "8.1M yesterday",
    icon: ArrowLeftRightIcon,
  },
  {
    label: "Failed Syncs",
    period: "14 days",
    value: "7",
    delta: "5",
    direction: "up",
    tone: "destructive",
    comparison: "2 yesterday, 19 in 14 days",
    icon: TriangleAlertIcon,
  },
]

const stats3Tokens = {
  section: "w-full py-4",
  grid: "mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-0",
  header: "flex items-center justify-between gap-3",
  identity: "flex min-w-0 items-center gap-2",
  icon: "size-3.5 shrink-0 text-muted-foreground",
  label: "truncate text-sm font-semibold tracking-tight text-foreground",
  period: "shrink-0 text-xs text-muted-foreground",
  metricRow: "mt-4 flex items-center gap-2",
  value: "text-2xl font-semibold leading-none tracking-tight text-foreground tabular-nums",
  suffix: "text-base font-medium text-muted-foreground",
  positiveDelta: "border-success/20 bg-success/10 text-success",
  negativeDelta: "border-destructive/20 bg-destructive/10 text-destructive",
  deltaIcon: "size-3",
  comparison: "mt-2 text-xs text-muted-foreground",
} as const

function MetricCard({ metric }: { metric: Stats3Metric }) {
  const DeltaIcon = metric.direction === "up" ? ArrowUpIcon : ArrowDownIcon

  return (
    <Frame>
      <FramePanel>
        <header className={stats3Tokens.header}>
          <div className={stats3Tokens.identity}>
            <metric.icon aria-hidden="true" className={stats3Tokens.icon} />
            <h2 className={stats3Tokens.label}>{metric.label}</h2>
          </div>
          <span className={stats3Tokens.period}>{metric.period}</span>
        </header>

        <div className={stats3Tokens.metricRow}>
          <p className={stats3Tokens.value}>
            {metric.value}
            {metric.suffix ? (
              <span className={stats3Tokens.suffix}>{metric.suffix}</span>
            ) : null}
          </p>
          <Badge
            className={
              metric.tone === "success"
                ? stats3Tokens.positiveDelta
                : stats3Tokens.negativeDelta
            }
          >
            <DeltaIcon aria-hidden="true" className={stats3Tokens.deltaIcon} />
            {metric.delta}
          </Badge>
        </div>

        <p className={stats3Tokens.comparison}>{metric.comparison}</p>
      </FramePanel>
    </Frame>
  )
}

export function Stats3() {
  return (
    <section
      aria-label="Connection and sync metrics"
      className={stats3Tokens.section}
    >
      <div className={stats3Tokens.grid}>
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  )
}
