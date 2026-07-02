"use client"

import { useEffect, useRef, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
]
const JOURS = ["L", "M", "M", "J", "V", "S", "D"]

// Format lisible stocké dans les données, ex. « 12 juil. 2026 ».
function formatDate(d: Date) {
  const moisCourt = MOIS[d.getMonth()].slice(0, 4).replace("é", "é")
  return `${d.getDate()} ${moisCourt}. ${d.getFullYear()}`
}

// Calendrier déroulant léger, sans dépendance externe.
export function DatePicker({
  value,
  onChange,
  placeholder = "Choisir une date",
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => new Date())
  const ref = useRef<HTMLDivElement>(null)

  // Ferme le calendrier au clic à l'extérieur.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const year = view.getFullYear()
  const month = view.getMonth()
  const first = new Date(year, month, 1)
  // Décalage pour démarrer la semaine le lundi.
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isSelected = (day: number) => value === formatDate(new Date(year, month, day))
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-left text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={cn(!value && "text-muted-foreground/70")}>{value || placeholder}</span>
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Choisir une échéance"
          className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-border bg-popover p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setView(new Date(year, month - 1, 1))}
              aria-label="Mois précédent"
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <span className="text-sm font-medium capitalize text-foreground">
              {MOIS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setView(new Date(year, month + 1, 1))}
              aria-label="Mois suivant"
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {JOURS.map((j, i) => (
              <span key={i} className="flex h-7 items-center justify-center text-xs text-muted-foreground">
                {j}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) =>
              day === null ? (
                <span key={i} className="size-7" />
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(formatDate(new Date(year, month, day)))
                    setOpen(false)
                  }}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md text-sm tabular-nums transition-colors",
                    isSelected(day)
                      ? "bg-primary font-medium text-primary-foreground"
                      : "text-foreground hover:bg-secondary",
                    !isSelected(day) && isToday(day) && "font-semibold text-primary",
                  )}
                >
                  {day}
                </button>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
