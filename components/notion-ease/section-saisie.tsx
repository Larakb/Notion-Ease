"use client"

import { useState } from "react"
import { BookOpen, Bookmark, ChevronDown, Clock, Plus, Shield, Trash2, UserRound } from "lucide-react"
import {
  faq,
  fatigueOptions,
  objectifOptions,
  profilOptions,
  ressources,
  type Ressource,
} from "@/lib/data"
import { useSession, type Projet, type Statut } from "@/lib/session-store"
import { Card, SectionTitle } from "./primitives"
import { ArticleReader } from "./article-reader"
import { DatePicker } from "./date-picker"
import { cn } from "@/lib/utils"

const statuts: { value: Statut; label: string }[] = [
  { value: "sain", label: "Serein" },
  { value: "tendu", label: "Tendu" },
  { value: "surcharge", label: "Surcharge" },
]

export function SectionSaisie() {
  const { profile, projets, updateProfile, addProjet, updateProjet, removeProjet } = useSession()
  const [article, setArticle] = useState<Ressource | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Mes données"
        title="Saisis tes informations"
        description="Modifie ton profil et ajoute tes projets. Tout le tableau de bord se met à jour instantanément."
      />

      {/* Profil */}
      <Card className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <UserRound className="size-4" aria-hidden />
          </span>
          <h3 className="font-heading text-lg font-semibold text-foreground">Mon profil</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Prénom">
            <TextInput
              value={profile.name}
              onChange={(v) => updateProfile({ name: v })}
              placeholder="Ton prénom"
            />
          </Field>
          <Field label="Statut">
            <SelectInput
              value={profile.profil}
              onChange={(v) => updateProfile({ profil: v })}
              options={profilOptions}
              placeholder="Choisis ton statut"
            />
          </Field>
          <Field label="Objectif principal">
            <SelectInput
              value={profile.objectif ?? ""}
              onChange={(v) => updateProfile({ objectif: v })}
              options={objectifOptions}
              placeholder="Choisis ton objectif"
            />
          </Field>
          <Field label="Niveau de fatigue ressenti">
            <SelectInput
              value={profile.fatigue ?? ""}
              onChange={(v) => updateProfile({ fatigue: v })}
              options={fatigueOptions}
              placeholder="Choisis ce qui t'épuise le plus"
            />
          </Field>
        </div>
      </Card>

      {/* Projets */}
      <Card className="flex flex-col gap-5">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Mes projets</h3>
          <p className="text-sm text-muted-foreground">
            Ajoute, modifie ou supprime tes projets. Ils alimentent la section Analyse.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {projets.map((p) => (
            <ProjetRow
              key={p.id}
              projet={p}
              onChange={(patch) => updateProjet(p.id, patch)}
              onRemove={() => removeProjet(p.id)}
            />
          ))}
        </div>

        <NewProjetForm onAdd={addProjet} />
      </Card>

      {/* Articles enregistrés */}
      <SavedArticles onOpen={setArticle} />

      {/* Confidentialité & FAQ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col gap-3 bg-accent/40 lg:col-span-1">
          <span className="flex size-10 items-center justify-center rounded-xl bg-card">
            <Shield className="size-5 text-primary" aria-hidden />
          </span>
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Tes données t'appartiennent
          </h3>
          <p className="text-pretty text-sm leading-relaxed text-accent-foreground">
            Notion Ease analyse ton rythme, jamais le contenu de tes notes. Rien
            n'est revendu ni partagé. Tu gardes le contrôle, à tout moment.
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Questions fréquentes
          </h3>
          <FaqList />
        </Card>
      </div>

      {article ? (
        <ArticleReader article={article} onClose={() => setArticle(null)} />
      ) : null}
    </div>
  )
}

// Liste des articles enregistrés depuis la page Ressources.
function SavedArticles({ onOpen }: { onOpen: (r: Ressource) => void }) {
  const { savedArticles, toggleSavedArticle } = useSession()
  const articles = ressources.filter((r) => savedArticles.includes(r.titre))

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Bookmark className="size-4" aria-hidden />
        </span>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Mes articles enregistrés</h3>
          <p className="text-sm text-muted-foreground">
            Retrouve ici les lectures que tu as sauvegardées depuis la page Ressources.
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          Aucun article enregistré pour l'instant. Dans « Ressources », touche l'icône
          <Bookmark className="mx-1 inline size-3.5 align-[-2px]" aria-hidden />
          d'un article pour le retrouver ici.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map((r) => {
            const lisible = Boolean(r.contenu?.length)
            return (
              <div
                key={r.titre}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3"
              >
                {r.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.image || "/placeholder.svg"}
                    alt=""
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-primary">{r.categorie}</p>
                  <p className="truncate font-medium text-foreground">{r.titre}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden />
                    {r.lecture}
                  </p>
                </div>
                {lisible ? (
                  <button
                    onClick={() => onOpen(r)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:border-primary/40"
                  >
                    <BookOpen className="size-4" aria-hidden />
                    Lire
                  </button>
                ) : null}
                <button
                  onClick={() => toggleSavedArticle(r.titre)}
                  aria-label={`Retirer ${r.titre} des articles enregistrés`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

function FaqList() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="flex flex-col divide-y divide-border">
      {faq.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="py-1">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-3 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-foreground">{item.q}</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <p className="pb-3 pr-8 text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.r}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Sous-composants ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  )
}

// Menu déroulant reprenant les choix de l'onboarding. Si la valeur actuelle
// (issue de l'onboarding, parfois multiple) n'est pas dans la liste, on l'ajoute.
function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  const allOptions = value && !options.includes(value) ? [value, ...options] : options
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="" disabled>
          {placeholder ?? "Choisir…"}
        </option>
        {allOptions.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  )
}

function NumField({
  value,
  onChange,
  unit,
  srLabel,
  mobileLabel,
}: {
  value: number
  onChange: (v: number) => void
  unit?: string
  srLabel: string
  mobileLabel: string
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{mobileLabel}</label>
      <div className="relative">
        <input
          type="number"
          min={0}
          step={0.5}
          value={value}
          aria-label={srLabel}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm tabular-nums text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {unit ? (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function ProjetRow({
  projet,
  onChange,
  onRemove,
}: {
  projet: Projet
  onChange: (patch: Partial<Projet>) => void
  onRemove: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/30 p-4">
      <div className="flex items-start gap-3">
        <input
          type="text"
          value={projet.nom}
          aria-label="Nom du projet"
          onChange={(e) => onChange({ nom: e.target.value })}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={onRemove}
          aria-label={`Supprimer ${projet.nom}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Tâches
          <input
            type="number"
            min={0}
            value={projet.taches}
            onChange={(e) => onChange({ taches: Math.max(0, Number(e.target.value)) })}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm tabular-nums text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Échéance</span>
          <DatePicker
            value={projet.echeance}
            onChange={(v) => onChange({ echeance: v })}
            placeholder="Choisir une date"
          />
        </div>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Statut
          <select
            value={projet.statut}
            onChange={(e) => onChange({ statut: e.target.value as Statut })}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {statuts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

function NewProjetForm({ onAdd }: { onAdd: (p: Omit<Projet, "id">) => void }) {
  const [nom, setNom] = useState("")
  const [charge, setCharge] = useState(40)
  const [taches, setTaches] = useState(3)
  const [echeance, setEcheance] = useState("")
  const [statut, setStatut] = useState<Statut>("sain")

  const submit = () => {
    if (!nom.trim()) return
    onAdd({
      nom: nom.trim(),
      charge,
      taches,
      echeance: echeance.trim() || "Pas de date",
      statut,
    })
    setNom("")
    setCharge(40)
    setTaches(3)
    setEcheance("")
    setStatut("sain")
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border p-4">
      <p className="text-sm font-medium text-foreground">Ajouter un projet</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={nom}
          placeholder="Nom du nouveau projet"
          aria-label="Nom du nouveau projet"
          onChange={(e) => setNom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) submit()
          }}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="sm:w-40">
          <DatePicker value={echeance} onChange={setEcheance} placeholder="Échéance (option.)" />
        </div>
        <select
          value={statut}
          aria-label="Statut du nouveau projet"
          onChange={(e) => setStatut(e.target.value as Statut)}
          className="rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {statuts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={submit}
          disabled={!nom.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden />
          Ajouter
        </button>
      </div>
    </div>
  )
}
