"use client"

import {
  Home,
  MessageSquare,
  Search,
  Inbox,
  Calendar,
  Mail,
  Plus,
  FileText,
  SquareCheckBig,
  Pencil,
  Briefcase,
  BookOpen,
  AudioLines,
  ChevronDown,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  Link2,
  MoreHorizontal,
  Sparkles,
  Database,
} from "lucide-react"

// Pictogramme monochrome à deux vagues, dans le style des icônes Notion (Mail, Calendar).
function TwoWaves(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 9c.6.5 1.2 1 2.5 1C7 10 7 8 9.5 8c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1" />
      <path d="M2 15c.6.5 1.2 1 2.5 1C7 16 7 14 9.5 14c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1" />
    </svg>
  )
}

type AppItem = {
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  iconClass?: string
  onClick?: () => void
  highlight?: boolean
}

export function NotionWorkspace({ onOpenEase }: { onOpenEase: () => void }) {
  const privatePages = [
    { label: "Projet de fin d'étude", icon: FileText },
    { label: "Cours", icon: BookOpen },
    { label: "To do list", icon: SquareCheckBig },
    { label: "Notes", icon: Pencil },
    { label: "Suivi de candidatures", icon: Briefcase },
    { label: "Nouvelle page", icon: FileText },
  ]

  const notionApps: AppItem[] = [
    { label: "Notion Mail", icon: Mail },
    { label: "Notion Calendar", icon: Calendar },
    {
      label: "Notion Ease",
      icon: TwoWaves,
      onClick: onOpenEase,
      highlight: true,
    },
  ]

  return (
    <div className="flex min-h-screen bg-[#191919] text-[#9b9b9b]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-[#202020] md:flex">
        <div className="flex items-center gap-2 px-3 py-3">
          <span className="flex size-6 items-center justify-center rounded bg-gradient-to-br from-rose-400 to-amber-300 text-[10px]">
            
          </span>
          <span className="text-sm font-medium text-[#e3e3e3]">Notion de Lara</span>
          <ChevronDown className="ml-auto size-4 text-[#6b6b6b]" aria-hidden />
        </div>

        <nav className="flex flex-col gap-0.5 px-2">
          {[
            { label: "Accueil", icon: Home, active: true },
            { label: "Boîte de réception", icon: Inbox },
            { label: "Recherche", icon: Search },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/5 ${
                item.active ? "bg-white/10 text-[#e3e3e3]" : "text-[#9b9b9b]"
              }`}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-5 px-2">
          <p className="px-2 pb-1 text-xs font-medium text-[#6b6b6b]">Réunions</p>
          <button className="flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-[#9b9b9b] transition-colors hover:bg-white/5">
            <Calendar className="mt-0.5 size-4 shrink-0 text-sky-400" aria-hidden />
            <span>
              <span className="block text-[#e3e3e3]">Connecter ton calendrier</span>
              <span className="block text-xs leading-snug text-[#6b6b6b]">
                Consulte tes événements et crée des notes de réunion.
              </span>
            </span>
          </button>
          <button className="mt-1 flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-[#9b9b9b] transition-colors hover:bg-white/5">
            <AudioLines className="size-4" aria-hidden />
            Nouvelle Note d'IA
          </button>
        </div>

        <div className="mt-5 px-2">
          <p className="px-2 pb-1 text-xs font-medium text-[#6b6b6b]">Pages privées</p>
          <div className="flex flex-col gap-0.5">
            {privatePages.map((p) => (
              <button
                key={p.label}
                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-[#9b9b9b] transition-colors hover:bg-white/5"
              >
                <p.icon className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 px-2 pb-4">
          <p className="px-2 pb-1 text-xs font-medium text-[#6b6b6b]">Applications Notion</p>
          <div className="flex flex-col gap-0.5">
            {notionApps.map((app) => (
              <button
                key={app.label}
                onClick={app.onClick}
                className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/5 ${
                  app.highlight ? "text-[#e3e3e3]" : "text-[#9b9b9b]"
                }`}
              >
                <app.icon className={`size-4 shrink-0 ${app.iconClass ?? ""}`} aria-hidden />
                <span>{app.label}</span>
                {app.highlight ? (
                  <span className="ml-auto rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                    Nouveau
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5">
          <PanelLeft className="size-4 text-[#6b6b6b]" aria-hidden />
          <ChevronLeft className="size-4 text-[#6b6b6b]" aria-hidden />
          <ChevronRight className="size-4 text-[#6b6b6b]" aria-hidden />
          <span className="text-sm text-[#e3e3e3]">Nouvelle page</span>
          <div className="ml-auto flex items-center gap-3 text-[#6b6b6b]">
            <span className="hidden text-xs sm:inline">Dernière modification : à l'instant</span>
            <Star className="size-4" aria-hidden />
            <Link2 className="size-4" aria-hidden />
            <MoreHorizontal className="size-4" aria-hidden />
          </div>
        </header>

        {/* Mobile hint to open Notion Ease */}
        <div className="border-b border-white/5 px-4 py-3 md:hidden">
          <button
            onClick={onOpenEase}
            className="flex w-full items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-[#e3e3e3]"
          >
            <TwoWaves className="size-4 shrink-0" aria-hidden />
            Ouvrir Notion Ease
            <span className="ml-auto rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
              Nouveau
            </span>
          </button>
        </div>

        {/* Page body */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold text-white/15 sm:text-5xl">Nouvelle page</h1>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#6b6b6b]">Premiers pas…</span>
            {[
              { label: "Demander à l'IA", icon: Sparkles },
              { label: "Notes de réunion générées par l'IA", icon: AudioLines },
              { label: "Base de données", icon: Database },
            ].map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[#9b9b9b]"
              >
                <b.icon className="size-3.5" aria-hidden />
                {b.label}
              </span>
            ))}
            <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
              <MoreHorizontal className="size-3.5" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
