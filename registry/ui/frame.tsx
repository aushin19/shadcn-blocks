import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type FrameContentProps = {
  children?: ReactNode
}

function Frame({ children }: FrameContentProps) {
  return <Card>{children}</Card>
}

function FramePanel({ children }: FrameContentProps) {
  return <CardContent>{children}</CardContent>
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
  FramePanel,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FrameFooter,
}