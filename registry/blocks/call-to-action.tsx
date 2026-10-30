import { Button } from "@/components/ui/button"

type CallToActionProps = {
  title?: string
  description?: string
  actionLabel?: string
  href: string
}

export function CallToAction({
  title = "Build something great.",
  description = "Start with components you own and make them your own.",
  actionLabel = "Get started",
  href,
}: CallToActionProps) {
  return (
    <section className="flex flex-col items-start gap-6 rounded-xl border bg-card p-6 text-card-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-lg text-sm text-muted-foreground">{description}</p>
      </div>
      <Button nativeButton={false} render={<a href={href} />}>
        {actionLabel}
      </Button>
    </section>
  )
}
