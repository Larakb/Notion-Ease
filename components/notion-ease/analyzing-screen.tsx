"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Logo } from "./logo"
import type { Profile } from "@/lib/data"

const etapes = [
  "Connexion à ton espace Notion",
  "Lecture de ton rythme de travail",
  "Analyse de ta charge et de tes échéances",
  "Repérage des pics de surcharge",
  "Préparation de tes recommandations",
]

export function AnalyzingScreen({
  profile,
  onDone,
}: {
  profile?: Profile | null
  onDone: () => void
}) {
  const [etape, setEtape] = useState(0)
  const prenom = profile?.name?.trim()

  useEffect(() => {
    // On avance étape par étape, puis on ouvre le tableau de bord.
    const dureeParEtape = 700
    const timers = etapes.map((_, i) =>
      setTimeout(() => setEtape(i + 1), dureeParEtape * (i + 1)),
    )
    const fin = setTimeout(onDone, dureeParEtape * (etapes.length + 1))
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(fin)
    }
  }, [onDone])

  const progress = Math.round((etape / etapes.length) * 100)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <div className="w-full max-w-md text-center">
        <Logo className="mx-auto size-16 animate-pulse" />
        <h1 className="mt-6 text-balance font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {prenom ? `On analyse tes données Notion` : "On analyse tes données Notion"}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-pretty leading-relaxed text-muted-foreground">
          Notion Ease examine tes éléments présents dans Notion pour te préparer une vue claire et sans jugement.
        </p>

        {/* Barre de progression */}
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-800 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression de l'analyse"
          />
        </div>

        {/* Étapes */}
        <ul className="mt-8 flex flex-col gap-3 text-left">
          {etapes.map((label, i) => {
            const fait = i < etape
            const enCours = i === etape
            return (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <span
                  className={
                    fait
                      ? "flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      : enCours
                        ? "flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
                        : "flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-transparent"
                  }
                  aria-hidden
                >
                  {fait ? (
                    <Check className="size-3.5" />
                  ) : enCours ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : null}
                </span>
                <span
                  className={
                    fait || enCours
                      ? "text-sm font-medium text-foreground"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
