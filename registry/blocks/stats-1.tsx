import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { Frame, FramePanel } from "@/components/reui/frame"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Stats1Metric = {
  label: string
  tooltip: string
  value: string
  delta: string
  direction: "up" | "down"
  comparison: string
}

const metrics: Stats1Metric[] = [
  {
    label: "All Orders",
    tooltip: "Total orders in the current reporting period.",
    value: "122,380",
    delta: "15.1%",
    direction: "up",
    comparison: "105,922",
  },
  {
    label: "Order Created",
    tooltip: "Orders created during the current reporting period.",
    value: "1.9M",
    delta: "-2%",
    direction: "down",
    comparison: "2.0M",
  },
  {
    label: "Organic Sales",
    tooltip: "Sales attributed to organic traffic during the current reporting period.",
    value: "$98.1M",
    delta: "0.4%",
    direction: "up",
    comparison: "$97.8M",
  },
  {
    label: "Active Users",
    tooltip: "Unique users active during the current reporting period.",
    value: "48,210",
    delta: "3.7%",
    direction: "up",
    comparison: "46,480",
  },
]

const stats1Tokens = {
  canvas: "w-full bg-background py-20 text-foreground",
  grid: "mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4",
  header: "flex items-center justify-between gap-3",
  label: "text-sm font-medium text-muted-foreground",
  tooltipTrigger: "underline decoration-dotted underline-offset-4",
  value: "mt-5 text-2xl font-medium tracking-tight tabular-nums",
  positiveDelta: "border-success/20 bg-success/10 text-success",
  negativeDelta: "border-destructive/20 bg-destructive/10 text-destructive",
  deltaIcon: "size-3",
  comparison: "text-xs text-muted-foreground",
  comparisonValue: "font-semibold text-foreground tabular-nums",
} as const

function MetricCard({ metric }: { metric: Stats1Metric }) {
  return (
    <Frame>
      <FramePanel>
        <header className={stats1Tokens.header}>
          <h2 className={stats1Tokens.label}>
            <Tooltip>
              <TooltipTrigger className={stats1Tokens.tooltipTrigger}>
                {metric.label}
              </TooltipTrigger>
              <TooltipContent>{metric.tooltip}</TooltipContent>
            </Tooltip>
          </h2>
          {metric.direction === "down" ? (
            <Badge className={stats1Tokens.negativeDelta}>
              <ArrowDownIcon
                aria-hidden="true"
                className={stats1Tokens.deltaIcon}
              />
              {metric.delta}
            </Badge>
          ) : (
            <Badge className={stats1Tokens.positiveDelta}>
              <ArrowUpIcon
                aria-hidden="true"
                className={stats1Tokens.deltaIcon}
              />
              {metric.delta}
            </Badge>
          )}
        </header>

        <p className={stats1Tokens.value}>{metric.value}</p>

        <Separator className="my-3" />

        <p className={stats1Tokens.comparison}>
          Vs last month:{" "}
          <span className={stats1Tokens.comparisonValue}>
            {metric.comparison}
          </span>
        </p>
      </FramePanel>
    </Frame>
  )
}

export function Stats1() {
  return (
    <section
      aria-label="Monthly commerce metrics"
      className={stats1Tokens.canvas}
    >
      <div className={stats1Tokens.grid}>
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  )
}
