"use client"

import { useState } from "react"
import {
  ArrowLeft,
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  BookOpen,
  PencilLine,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/session-store"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { ReadingModeToggle } from "./reading-mode-toggle"
import { SectionAccueil } from "./section-accueil"
import { SectionAnalyse } from "./section-analyse"
import { SectionRecommandations } from "./section-recommandations"
import { SectionRessources } from "./section-ressources"
import { SectionSaisie } from "./section-saisie"

const nav = [
  { id: "accueil", label: "Accueil", icon: LayoutDashboard },
  { id: "analyse", label: "Analyse", icon: BarChart3 },
  { id: "recommandations", label: "Recommandations", icon: Lightbulb },
  { id: "ressources", label: "Ressources", icon: BookOpen },
  { id: "saisie", label: "Mes données", icon: PencilLine },
]

export function AppShell() {
  const [active, setActive] = useState("accueil")
  // Pile d'historique : on empile la section quittée pour pouvoir revenir en arrière.
  const [history, setHistory] = useState<string[]>([])
  const { profile } = useSession()

  const name = profile.name
  const profil = profile.profil

  const navigate = (id: string) => {
    if (id !== active) setHistory((h) => [...h, active])
    setActive(id)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Navigation directe (barre latérale / onglets) : on repart d'un historique neuf.
  const navigateFromMenu = (id: string) => {
    setActive(id)
    setHistory([])
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    if (history.length === 0) return
    const previous = history[history.length - 1]
    setActive(previous)
    setHistory((h) => h.slice(0, -1))
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const canGoBack = history.length > 0

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand />
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => (
            <NavButton
              key={item.id}
              {...item}
              active={active === item.id}
              onClick={() => navigateFromMenu(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <button
            onClick={() => navigateFromMenu("saisie")}
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-sidebar-border bg-card p-3 text-left transition-colors hover:border-primary/40"
          >
            <img
              src="/avatar.jpg"
              alt={`Photo de profil de ${name}`}
              className="size-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{profil}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          {canGoBack ? <BackButton onClick={goBack} /> : <Brand />}
          <div className="flex items-center gap-2">
            <ReadingModeToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Topbar desktop */}
        <header className="sticky top-0 z-10 hidden items-center justify-between gap-3 border-b border-border bg-background/80 px-8 py-4 backdrop-blur lg:flex">
          {canGoBack ? <BackButton onClick={goBack} /> : <span />}
          <div className="flex items-center gap-3">
            <ReadingModeToggle />
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-12">
          {active === "accueil" && <SectionAccueil onNavigate={navigate} />}
          {active === "analyse" && <SectionAnalyse />}
          {active === "recommandations" && <SectionRecommandations />}
          {active === "ressources" && <SectionRessources />}
          {active === "saisie" && <SectionSaisie />}
        </main>
      </div>

      {/* Navigation mobile bas */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-background/95 px-2 py-2 backdrop-blur lg:hidden">
        {nav.map((item) => {
          const isActive = active === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => navigateFromMenu(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" aria-hidden />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
    >
      <ArrowLeft className="size-4" aria-hidden />
      Retour
    </button>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <Logo className="size-9" />
      <div className="leading-tight">
        <p className="font-heading text-base font-semibold tracking-tight text-foreground">
          Notion Ease
        </p>
        <p className="text-[11px] text-muted-foreground">Travailler sans s'épuiser</p>
      </div>
    </div>
  )
}

function NavButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  id: string
  label: string
  icon: typeof LayoutDashboard
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-secondary hover:text-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-4.5" aria-hidden />
      {label}
    </button>
  )
}
