import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame"

export function Pattern() {
  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Section header</FrameTitle>
        <FrameDescription>Description for the section</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Section title 2</h2>
        <p className="text-sm text-muted-foreground">Section description</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-sm text-muted-foreground">Section footer</p>
      </FrameFooter>
    </Frame>
  )
}
