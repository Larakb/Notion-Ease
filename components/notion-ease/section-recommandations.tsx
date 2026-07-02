"use client"

import { useState } from "react"
import { Check, Lightbulb, Sparkles } from "lucide-react"
import { recommandations } from "@/lib/data"
import { Card, SectionTitle } from "./primitives"
import { cn } from "@/lib/utils"

export function SectionRecommandations() {
  const [faites, setFaites] = useState<number[]>([])

  const toggle = (id: number) =>
    setFaites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Recommandations"
        title="Des pistes concrètes, à ton rythme"
        description="Aucune injonction ici. Ce sont des suggestions bienveillantes que tu peux suivre, adapter ou ignorer selon ce qui te convient."
      />

      <Card className="flex items-start gap-3 bg-accent/50">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-card">
          <Sparkles className="size-4.5 text-primary" aria-hidden />
        </span>
        <p className="text-pretty text-sm leading-relaxed text-accent-foreground">
          Cette semaine, ta priorité est d'éviter le cumul de jeudi et vendredi.
          Deux ajustements suffisent à reprendre de l'air.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {recommandations.map((r) => {
          const done = faites.includes(r.id)
          return (
            <Card
              key={r.id}
              className={cn(
                "flex flex-col gap-3 transition-colors",
                done && "bg-secondary/40",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  <Lightbulb className="size-4" aria-hidden />
                  {r.type}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    r.priorite === "Prioritaire"
                      ? "bg-[#f6d6c9] text-[#8f4a30]"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {r.priorite}
                </span>
              </div>
              <h3
                className={cn(
                  "font-heading text-lg font-semibold text-foreground",
                  done && "text-muted-foreground line-through",
                )}
              >
                {r.titre}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {r.corps}
              </p>
              <button
                onClick={() => toggle(r.id)}
                className={cn(
                  "mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  done
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/40",
                )}
              >
                <Check className="size-4" aria-hidden />
                {done ? "Pris en compte" : "Marquer comme pris en compte"}
              </button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
