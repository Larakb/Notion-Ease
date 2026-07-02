"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Check,
  Gauge,
  Layers,
  Sun,
  Battery,
  Compass,
  Sparkles,
  GraduationCap,
  Rocket,
  Laptop,
  HeartPulse,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Profile } from "@/lib/data"
import { Logo } from "./logo"

type Status = { value: string; label: string; icon: typeof GraduationCap }

const statuses: Status[] = [
  { value: "etudiant", label: "Étudiant·e", icon: GraduationCap },
  { value: "actif", label: "Jeune actif·ve", icon: Rocket },
  { value: "freelance", label: "Freelance", icon: Laptop },
]

type Option = { value: string; label: string; hint?: string }
type Question = {
  id: string
  icon: typeof Gauge
  eyebrow: string
  title: string
  description: string
  options: Option[]
  multi?: boolean // autorise plusieurs réponses
}

const questions: Question[] = [
  {
    id: "rythme",
    icon: Gauge,
    eyebrow: "Ton rythme",
    title: "Comment décrirais-tu ton rythme de travail en ce moment ?",
    description: "Il n'y a pas de bonne réponse !",
    options: [
      { value: "regulier", label: "Régulier et soutenable", hint: "Je tiens la distance" },
      { value: "acoups", label: "Par à-coups", hint: "J'alterne calme et rushs" },
      { value: "intense", label: "Intense en ce moment", hint: "Je sens la pression monter" },
      { value: "flou", label: "Je ne sais pas trop", hint: "C'est justement à clarifier" },
    ],
  },
  {
    id: "projets",
    icon: Layers,
    eyebrow: "Ta charge",
    title: "Combien de projets gères-tu en parallèle ?",
    description: "On parle de tout : études, travail, projets perso.",
    options: [
      { value: "1-2", label: "1 à 2 projets" },
      { value: "3-4", label: "3 à 4 projets" },
      { value: "5+", label: "5 projets ou plus" },
    ],
  },
  {
    id: "energie",
    icon: Sun,
    eyebrow: "Ton énergie",
    title: "À quel moment te sens-tu le plus concentré·e ?",
    description: "On adaptera tes créneaux clés à ton énergie naturelle.",
    options: [
      { value: "matin", label: "Le matin", hint: "Frais et clair" },
      { value: "aprem", label: "L'après-midi", hint: "Une fois lancé·e" },
      { value: "soir", label: "Le soir", hint: "Quand tout est calme" },
      { value: "varie", label: "Ça varie beaucoup", hint: "Selon les jours" },
    ],
  },
  {
    id: "fatigue",
    icon: Battery,
    eyebrow: "Tes limites",
    title: "Qu'est-ce qui t'épuise le plus dans ton organisation ?",
    description: "On surveillera ce point de près pour toi.",
    options: [
      { value: "taches", label: "Trop de tâches en même temps" },
      { value: "pauses", label: "Le manque de pauses" },
      { value: "notifs", label: "Les notifications constantes" },
      { value: "deconnexion", label: "La difficulté à déconnecter" },
    ],
  },
  {
    id: "trouble",
    icon: HeartPulse,
    eyebrow: "Ton fonctionnement",
    title: "As-tu un trouble dont on devrait tenir compte ?",
    description:
      "Plusieurs réponses possibles. Cela reste confidentiel et nous aide à ajuster ta capacité et l'analyse de ta charge.",
    multi: true,
    options: [
      { value: "aucun", label: "Aucun en particulier" },
      { value: "tdah", label: "TDAH / trouble de l'attention", hint: "Concentration en dents de scie" },
      { value: "anxiete", label: "Trouble anxieux", hint: "Charge émotionnelle en plus" },
      { value: "dys", label: "Trouble DYS", hint: "Dyslexie, dyspraxie…" },
      { value: "hpi", label: "Haut potentiel (HPI)", hint: "Sur-sollicitation mentale" },
      { value: "prefere-pas", label: "Je préfère ne pas préciser" },
    ],
  },
  {
    id: "objectif",
    icon: Compass,
    eyebrow: "Ton objectif",
    title: "Quel équilibre aimerais-tu retrouver ?",
    description: "Plusieurs réponses possibles. Ce sera le fil rouge de tes recommandations.",
    multi: true,
    options: [
      { value: "charge", label: "Mieux répartir ma charge" },
      { value: "pauses", label: "M'accorder plus de pauses" },
      { value: "deconnexion", label: "Mieux déconnecter le soir" },
      { value: "limites", label: "Comprendre mes limites" },
    ],
  },
]

export function Onboarding({ onComplete }: { onComplete: (profile: Profile) => void }) {
  const [phase, setPhase] = useState<"identity" | "questions">("identity")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [status, setStatus] = useState<string[]>([])

  const total = questions.length + 1 // + l'étape d'identité
  const current = questions[step]
  const currentAnswers = answers[current?.id] ?? []
  const canContinueIdentity = firstName.trim().length > 0 && status.length > 0

  const submitIdentity = () => {
    if (!canContinueIdentity) return
    setPhase("questions")
  }

  const advance = () => {
    if (step < questions.length - 1) {
      setStep((s) => s + 1)
      setSelected(null)
    } else {
      setDone(true)
    }
  }

  // Question à réponse unique : on enregistre puis on avance automatiquement.
  const choose = (value: string) => {
    if (selected) return
    setSelected(value)
    setAnswers((prev) => ({ ...prev, [current.id]: [value] }))
    setTimeout(advance, 420)
  }

  // Question à choix multiples : on ajoute/retire la réponse, sans avancer.
  const toggle = (value: string) => {
    setAnswers((prev) => {
      const cur = prev[current.id] ?? []
      const next = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value]
      return { ...prev, [current.id]: next }
    })
  }

  const goBack = () => {
    if (step === 0) {
      setPhase("identity")
      setSelected(null)
      return
    }
    setStep((s) => s - 1)
    setSelected(null)
  }

  const finish = () => {
    const statusLabel =
      statuses
        .filter((s) => status.includes(s.value))
        .map((s) => s.label)
        .join(", ") || "Profil"
    // Concatène les libellés des réponses (utile pour les questions à choix multiples).
    const optionLabels = (qid: string) =>
      (answers[qid] ?? [])
        .map((v) => questions.find((q) => q.id === qid)?.options.find((o) => o.value === v)?.label)
        .filter(Boolean)
        .join(", ")
    onComplete({
      name: firstName.trim(),
      profil: statusLabel,
      objectif: optionLabels("objectif"),
      fatigue: optionLabels("fatigue"),
      trouble: (answers["trouble"] ?? []).join(","), // valeurs brutes, pour ajuster la charge
    })
  }

  // Numéro d'étape courant (1 = identité, 2.. = questions)
  const stepNumber = phase === "identity" ? 1 : step + 2
  const progress = done ? 100 : Math.round(((stepNumber - 1) / total) * 100)

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* En-tête fixe avec marque + progression */}
      <header className="mx-auto flex w-full max-w-xl items-center gap-4 px-5 pt-6 sm:pt-10">
        <div className="flex items-center gap-2.5">
          <Logo className="size-9" />
          <p className="font-heading text-base font-semibold tracking-tight text-foreground">
            Notion Ease
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {!done ? (
            <span className="text-sm font-medium text-muted-foreground tabular-nums">
              {stepNumber} / {total}
            </span>
          ) : null}
        </div>
      </header>

      <div className="mx-auto w-full max-w-xl px-5">
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression de la configuration"
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-10">
        {phase === "identity" ? (
          <div className="onboarding-fade">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
              <Logo className="size-4" />
              Faisons connaissance
            </span>
            <h1 className="mt-4 text-balance font-heading text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              Comment t'appelles-tu ?
            </h1>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              On personnalisera ton espace avec ton prénom et ton profil.
            </p>

            <div className="mt-8">
              <label
                htmlFor="prenom"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Ton prénom
              </label>
              <input
                id="prenom"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitIdentity()
                }}
                placeholder="Ex. Lara"
                autoComplete="given-name"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <fieldset className="mt-6">
              <legend className="mb-2 block text-sm font-medium text-foreground">
                Tu es plutôt… <span className="text-muted-foreground">(plusieurs choix possibles)</span>
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {statuses.map((s) => {
                  const isSelected = status.includes(s.value)
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() =>
                        setStatus((prev) =>
                          prev.includes(s.value)
                            ? prev.filter((v) => v !== s.value)
                            : [...prev, s.value],
                        )
                      }
                      aria-pressed={isSelected}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center transition-all duration-200",
                        isSelected
                          ? "border-primary bg-accent ring-2 ring-primary/30"
                          : "border-border hover:border-primary/40 hover:bg-secondary",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        <s.icon className="size-5" aria-hidden />
                      </span>
                      <span className="text-sm font-medium text-foreground">{s.label}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <button
              onClick={submitIdentity}
              disabled={!canContinueIdentity}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuer
            </button>
            <p className="mt-6 text-sm text-muted-foreground">
              Tes réponses restent privées et servent uniquement à personnaliser ton espace.
            </p>
          </div>
        ) : !done ? (
          <div key={current.id} className="onboarding-fade">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
              <current.icon className="size-3.5" aria-hidden />
              {current.eyebrow}
            </span>
            <h1 className="mt-4 text-balance font-heading text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              {current.title}
            </h1>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              {current.description}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {current.options.map((opt) => {
                const isSelected = current.multi
                  ? currentAnswers.includes(opt.value)
                  : selected === opt.value
                const isLocked = !current.multi && !!selected
                return (
                  <button
                    key={opt.value}
                    onClick={() => (current.multi ? toggle(opt.value) : choose(opt.value))}
                    disabled={isLocked}
                    aria-pressed={current.multi ? isSelected : undefined}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl border bg-card p-4 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-accent ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-secondary",
                      isLocked && !isSelected ? "opacity-50" : "",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center border transition-colors",
                        current.multi ? "rounded-md" : "rounded-full",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-transparent group-hover:border-primary/50",
                      )}
                      aria-hidden
                    >
                      <Check className="size-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium text-foreground">{opt.label}</span>
                      {opt.hint ? (
                        <span className="block text-sm text-muted-foreground">{opt.hint}</span>
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex flex-col items-start gap-5">
              {current.multi ? (
                <button
                  onClick={advance}
                  disabled={currentAnswers.length === 0}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {step < questions.length - 1 ? "Continuer" : "Terminer"}
                </button>
              ) : null}

              <button
                onClick={goBack}
                disabled={!!selected}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                <ArrowLeft className="size-4" aria-hidden />
                {step === 0 ? "Revenir à mon profil" : "Question précédente"}
              </button>
            </div>
          </div>
        ) : (
          <div className="onboarding-fade text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Sparkles className="size-8" aria-hidden />
            </span>
            <h1 className="mt-6 text-balance font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {firstName.trim() ? `Ton espace est prêt, ${firstName.trim()}` : "Ton espace est prêt"}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
              On a calibré Notion Ease selon tes réponses. Tu pourras tout ajuster
              à tout moment : ici, on avance à ton allure.
            </p>
            <button
              onClick={finish}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Découvrir mon tableau de bord
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
