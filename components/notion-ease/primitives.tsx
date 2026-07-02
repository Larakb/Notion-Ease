import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { statutStyles, type Statut } from "@/lib/data"

export function Card({
  children,
  className,
  ...rest
}: {
  children: ReactNode
  className?: string
} & ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 sm:p-6",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="mb-1.5 text-sm font-medium text-primary">{eyebrow}</p>
      ) : null}
      <h1 className="text-balance font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function StatutBadge({ statut }: { statut: Statut }) {
  const s = statutStyles[statut]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        s.fond,
        s.texte,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {s.libelle}
    </span>
  )
}
