"use client"

import { useState } from "react"
import { AlertTriangle, Calendar, History } from "lucide-react"
import { historiqueAnnee, historiqueMois, surcharges, type PeriodeHistorique } from "@/lib/data"
import { useSession } from "@/lib/session-store"
import { Card, SectionTitle, StatutBadge } from "./primitives"
import { LoadEvolutionChart, ProjectLoadBar } from "./charts"
import { cn } from "@/lib/utils"

type Periode = "mois" | "annee"

export function SectionAnalyse() {
  const { projets } = useSession()
  const [periode, setPeriode] = useState<Periode>("mois")
  const historique = periode === "annee" ? historiqueAnnee : historiqueMois
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Analyse"
        title="Comprendre d'où vient ta charge"
        description="On regarde ensemble comment ta charge se répartit, comment elle évolue, et les moments où elle dépasse tes limites."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Évolution */}
        <Card className="lg:col-span-3">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Évolution de ta charge de travail
              </h3>
              <p className="text-sm text-muted-foreground">
                {periode === "annee"
                  ? "Sur les 12 derniers mois. Au-delà du seuil, le risque de surcharge augmente."
                  : "Sur les 8 dernières semaines. Au-delà du seuil, le risque de surcharge augmente."}
              </p>
            </div>
            <PeriodeToggle value={periode} onChange={setPeriode} />
          </div>
          <LoadEvolutionChart periode={periode} />
        </Card>

        {/* Périodes de surcharge */}
        <Card className="lg:col-span-2">
          <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">
            Pics de surcharge détectés
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Les fenêtres à anticiper cette semaine.
          </p>
          <div className="flex flex-col gap-3">
            {surcharges.map((s) => (
              <div
                key={s.fenetre}
                className="rounded-xl border border-border bg-secondary/40 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-medium text-foreground">
                    <Calendar className="size-4 text-muted-foreground" aria-hidden />
                    {s.fenetre}
                  </span>
                  <StatutBadge statut={s.statut} />
                </div>
                <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-[oklch(0.62_0.16_28)]" aria-hidden />
                  {s.cause}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charge par projet */}
      <Card>
        <div className="mb-5">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Répartition par projet
          </h3>
          <p className="text-sm text-muted-foreground">
            Ton niveau de charge par projet cette semaine.
          </p>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {projets.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{p.nom}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.taches} tâches · {p.echeance}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:w-72">
                <div className="flex-1">
                  <ProjectLoadBar value={p.charge} statut={p.statut} />
                </div>
                <span className="w-10 text-right text-sm font-medium tabular-nums text-foreground">
                  {p.charge}%
                </span>
                <div className="w-24 shrink-0 text-right">
                  <StatutBadge statut={p.statut} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Historique : retrouver ses données passées */}
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <History className="size-4" aria-hidden />
            </span>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Ton historique
              </h3>
              <p className="text-sm text-muted-foreground">
                Retrouve tes données des périodes passées et compare ton équilibre dans le temps.
              </p>
            </div>
          </div>
          <PeriodeToggle value={periode} onChange={setPeriode} />
        </div>
        <div className="flex flex-col divide-y divide-border">
          {historique.map((h) => (
            <HistoriqueRow key={h.periode} data={h} />
          ))}
        </div>
      </Card>
    </div>
  )
}

// Bascule entre la vue mensuelle et la vue annuelle.
function PeriodeToggle({
  value,
  onChange,
}: {
  value: Periode
  onChange: (p: Periode) => void
}) {
  const options: { value: Periode; label: string }[] = [
    { value: "mois", label: "Par mois" },
    { value: "annee", label: "Par année" },
  ]
  return (
    <div className="inline-flex shrink-0 rounded-full border border-border bg-secondary/40 p-0.5">
      {options.map((o) => {
        const actif = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={actif}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              actif
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// Ligne d'historique : indice d'équilibre + repères de charge d'une période passée.
function HistoriqueRow({ data }: { data: PeriodeHistorique }) {
  const statut = data.score >= 70 ? "sain" : data.score >= 55 ? "tendu" : "surcharge"
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <MiniRing score={data.score} ressenti={data.ressenti} />
        <p className="min-w-0 truncate font-medium text-foreground">{data.periode}</p>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <span className="text-muted-foreground">
          Rythme <span className="font-medium tabular-nums text-foreground">{data.heuresMoy} h/j</span>
        </span>
        <StatutBadge statut={statut} />
      </div>
    </div>
  )
}

// Version compacte de l'anneau « Ton équilibre » pour les lignes d'historique :
// mêmes couleurs et même forme, avec le ressenti affiché au centre.
function MiniRing({ score, ressenti }: { score: number; ressenti: string }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="relative flex size-16 shrink-0 items-center justify-center">
      <svg
        className="size-16 -rotate-90"
        viewBox="0 0 64 64"
        role="img"
        aria-label={`Indice d'équilibre : ${ressenti} (${score} sur 100)`}
      >
        <circle cx="32" cy="32" r={radius} fill="none" stroke="oklch(0.93 0.012 95)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#a7c8a0"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute max-w-[3.25rem] text-balance text-center text-[0.6rem] font-medium leading-tight text-foreground">
        {ressenti}
      </span>
    </div>
  )
}
