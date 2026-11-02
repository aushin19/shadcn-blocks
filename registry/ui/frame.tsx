import type { ReactNode } from "react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type FrameContentProps = {
  children?: ReactNode
}

function Frame({ children }: FrameContentProps) {
  return (
    <Card className="min-h-40 w-full gap-0 bg-muted/50 p-1" data-slot="frame">
      {children}
    </Card>
  )
}

function FrameGroup({ children }: FrameContentProps) {
  return (
    <Card className="w-full gap-0 bg-muted/50 p-1" data-slot="frame-group">
      {children}
    </Card>
  )
}

function FramePanel({ children }: FrameContentProps) {
  return (
    <Card className="w-full grow gap-0 bg-card/50 p-4" data-slot="frame-panel">
      {children}
    </Card>
  )
}

function FrameHeader({ children }: FrameContentProps) {
  return <CardHeader>{children}</CardHeader>
}

function FrameTitle({ children }: FrameContentProps) {
  return <CardTitle>{children}</CardTitle>
}

function FrameDescription({ children }: FrameContentProps) {
  return <CardDescription>{children}</CardDescription>
}

function FrameFooter({ children }: FrameContentProps) {
  return <CardFooter>{children}</CardFooter>
}

export {
  Frame,
  FrameGroup,
  FramePanel,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FrameFooter,
}
