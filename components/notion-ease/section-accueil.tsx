"use client"

import {
  ArrowRight,
  BatteryCharging,
  Brain,
  Clock,
  Coffee,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"
import { recommandations, ressources, statutStyles, user, type Statut } from "@/lib/data"
import { useSession, type Indicateur } from "@/lib/session-store"
import { Card, SectionTitle } from "./primitives"
import { WellbeingRing } from "./wellbeing-ring"
import { WeekLoadChart } from "./charts"
import { WeekQuickEdit } from "./week-quick-edit"
import { ArticleReader } from "./article-reader"

const indicateurIcons: Record<string, typeof Brain> = {
  rythme: Clock,
  focus: Brain,
  pause: Coffee,
  energie: BatteryCharging,
}

// Couleur du pictogramme par indicateur (fond + icône).
const pictoParId: Record<string, { bg: string; fg: string }> = {
  rythme: { bg: "#dce5e8", fg: "#3b545f" }, // bleu
  pause: { bg: "#a7c8a0", fg: "#33502e" }, // vert
  energie: { bg: "#f6d6c9", fg: "#8f4a30" }, // rose
  focus: { bg: "#b7aedc", fg: "#453a70" }, // lavande
}

const moisFr = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
]

// Renvoie la semaine en cours (lundi -> dimanche), formatée en français.
function semaineCourante(): string {
  const now = new Date()
  const jour = now.getDay() // 0 = dimanche
  const decalLundi = jour === 0 ? -6 : 1 - jour
  const lundi = new Date(now)
  lundi.setDate(now.getDate() + decalLundi)
  const dimanche = new Date(lundi)
  dimanche.setDate(lundi.getDate() + 6)

  const memeMois = lundi.getMonth() === dimanche.getMonth()
  if (memeMois) {
    return `Semaine du ${lundi.getDate()} au ${dimanche.getDate()} ${moisFr[dimanche.getMonth()]}`
  }
  return `Semaine du ${lundi.getDate()} ${moisFr[lundi.getMonth()]} au ${dimanche.getDate()} ${moisFr[dimanche.getMonth()]}`
}

export function SectionAccueil({
  onNavigate,
}: {
  onNavigate: (id: string) => void
}) {
  const { profile, indicateurs, wellbeing, easePlus } = useSession()
  const [articleOuvert, setArticleOuvert] = useState(false)
  const top = recommandations.filter((r) => r.priorite === "Prioritaire").slice(0, 2)
  // Article de fond suggéré en complément des recommandations.
  const suggestion = ressources.find((r) =>
    r.titre.startsWith("Comprendre sa charge de travail"),
  )
  const prenom = profile.name?.trim() || user.name
  const semaine = semaineCourante()

  // Mode de lecture Ease + : vue épurée, aérée et apaisante.
  if (easePlus) {
    return (
      <EasePlusAccueil
        prenom={prenom}
        semaine={semaine}
        wellbeing={wellbeing}
        indicateurs={indicateurs}
        topReco={top[0]}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow={`Bonjour ${prenom} · ${semaine}`}
        title="Voici comment se porte ton équilibre cette semaine"
        description="D'après tes données Notion, voici ce que nous avons analysé. Une vue d'ensemble de ton rythme pour t'aider à décider."
      />

      {/* Indice d'équilibre + message */}
      <Card className="flex flex-col items-center gap-6 bg-gradient-to-br from-accent/60 to-card sm:flex-row sm:gap-10">
        <WellbeingRing score={wellbeing.score} ressenti={wellbeing.ressenti} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {wellbeing.etat}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              <TrendingUp className="size-3.5" aria-hidden />+{wellbeing.tendance} pts cette semaine
            </span>
          </div>
          <p className="mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            {wellbeing.message}
          </p>
          <button
            onClick={() => onNavigate("recommandations")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voir mes recommandations
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </Card>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicateurs.map((ind) => {
          const Icon = indicateurIcons[ind.id] ?? Brain
          const s = statutStyles[ind.statut as Statut]
          const picto = pictoParId[ind.id] ?? pictoParId.focus
          return (
            <Card
              key={ind.id}
              className="flex flex-col gap-3 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex size-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: picto.bg }}
                >
                  <Icon className="size-4.5" style={{ color: picto.fg }} aria-hidden />
                </span>
                <span className={`size-2 rounded-full ${s.dot}`} aria-label={s.libelle} />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {ind.valeur}
                </p>
                <p className="text-sm font-medium text-foreground">{ind.label}</p>
                <p className="text-xs text-muted-foreground">{ind.detail}</p>
              </div>
              <p className="mt-auto text-pretty text-xs leading-relaxed text-muted-foreground">
                {ind.aide}
              </p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Charge de la semaine */}
        <Card className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Ta charge cette semaine
              </h3>
              <p className="text-sm text-muted-foreground">
                Réparti par type d'activité, en heures.
              </p>
            </div>
            <button
              onClick={() => onNavigate("analyse")}
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              Analyser <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
          <WeekLoadChart />
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <Legend color="#b7aedc" label="Concentration" />
            <Legend color="#dce5e8" label="Réunions" />
            <Legend color="#fff6d6" label="Personnel" />
          </div>
          <WeekQuickEdit />
        </Card>

        {/* Aperçu recommandations */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              À regarder en priorité
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {top.map((r) => (
              <button
                key={r.id}
                onClick={() => onNavigate("recommandations")}
                className="group rounded-xl border border-border bg-secondary/40 p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <p className="text-xs font-medium text-primary">{r.type}</p>
                <p className="mt-1 font-medium text-foreground">{r.titre}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {r.corps}
                </p>
              </button>
            ))}
          </div>

          {/* Article suggéré pour aller plus loin */}
          {suggestion ? (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Suggestion de lecture
              </p>
              <button
                onClick={() => setArticleOuvert(true)}
                className="group flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                {suggestion.image ? (
                  <img
                    src={suggestion.image || "/placeholder.svg"}
                    alt=""
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                ) : null}
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-primary">
                    {suggestion.categorie} · {suggestion.lecture}
                  </span>
                  <span className="mt-0.5 block truncate font-medium text-foreground">
                    {suggestion.titre}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    Lire l'article
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </span>
              </button>
            </div>
          ) : null}
        </Card>
      </div>

      {articleOuvert && suggestion ? (
        <ArticleReader article={suggestion} onClose={() => setArticleOuvert(false)} />
      ) : null}
    </div>
  )
}

// Vue « Ease + » : uniquement l'essentiel, beaucoup d'air et un fond apaisant.
function EasePlusAccueil({
  prenom,
  wellbeing,
  indicateurs,
  topReco,
  onNavigate,
}: {
  prenom: string
  semaine: string
  wellbeing: { score: number; ressenti: string; etat: string; message: string; tendance: number }
  indicateurs: Indicateur[]
  topReco?: { id: number; type: string; titre: string; corps: string }
  onNavigate: (id: string) => void
}) {
  // On ne garde que les 3 repères les plus parlants pour la journée.
  const ordre = ["energie", "rythme", "pause"]
  const essentiels = ordre
    .map((id) => indicateurs.find((i) => i.id === id))
    .filter((i): i is Indicateur => Boolean(i))

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-14 py-10 text-center sm:py-16">
      {/* En-tête minimal */}
      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-foreground">
          Lecture apaisée
        </span>
        <h1 className="text-balance font-heading text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          Bonjour {prenom}, respire un instant.
        </h1>
      </div>

      {/* Anneau d'équilibre, au centre de l'attention */}
      <div className="flex flex-col items-center gap-6">
        <WellbeingRing score={wellbeing.score} ressenti={wellbeing.ressenti} />
        <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
          {wellbeing.message}
        </p>
      </div>

      {/* Essentiels : 3 repères, sans détail superflu */}
      <div className="flex w-full flex-col gap-3">
        {essentiels.map((ind) => {
          const s = statutStyles[ind.statut as Statut]
          return (
            <div
              key={ind.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 px-6 py-4 text-left"
            >
              <span className="flex items-center gap-3">
                <span className={`size-2.5 rounded-full ${s.dot}`} aria-hidden />
                <span className="text-sm font-medium text-foreground">{ind.label}</span>
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {ind.valeur}
              </span>
            </div>
          )
        })}
      </div>

      {/* Une seule chose à retenir aujourd'hui */}
      {topReco ? (
        <div className="w-full rounded-2xl border border-primary/30 bg-primary/10 px-6 py-6 text-left">
          <p className="text-xs font-medium text-primary">L'essentiel aujourd'hui</p>
          <p className="mt-1.5 font-heading text-lg font-semibold text-foreground">
            {topReco.titre}
          </p>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            {topReco.corps}
          </p>
          <button
            onClick={() => onNavigate("recommandations")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voir mes recommandations
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {label}
    </span>
  )
}
