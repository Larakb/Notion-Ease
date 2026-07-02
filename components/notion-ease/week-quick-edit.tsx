"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { useSession } from "@/lib/session-store"
import { LevelSelect, EnergieSlider, concentrationOptions } from "./level-select"

// Champs d'heures modifiables et leur couleur de marque associée.
const champs = [
  { key: "pause", label: "Moment de pause", color: "#a7c8a0" },
  { key: "reunions", label: "Réunions", color: "#DCE5E8" },
  { key: "perso", label: "Personnel", color: "#fff6d6" },
] as const

export function WeekQuickEdit() {
  const { jours, updateJour } = useSession()
  const [openJour, setOpenJour] = useState<string | null>(null)

  return (
    <div className="mt-5 border-t border-border pt-4">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Pencil className="size-3.5" aria-hidden />
        Clique sur une journée pour modifier tes données
      </div>

      <div className="flex flex-wrap gap-2">
        {jours.map((j) => {
          const total = j.focus + j.reunions + j.perso
          const actif = openJour === j.jour
          return (
            <button
              key={j.jour}
              onClick={() => setOpenJour(actif ? null : j.jour)}
              aria-expanded={actif}
              className={`flex flex-col items-center rounded-xl border px-3 py-2 text-center transition-colors ${
                actif
                  ? "border-primary bg-accent/50"
                  : "border-border bg-secondary/40 hover:border-primary/40 hover:bg-accent/30"
              }`}
            >
              <span className="text-xs font-medium text-foreground">{j.jour}</span>
              <span className="text-xs text-muted-foreground">{Math.round(total * 10) / 10} h</span>
            </button>
          )
        })}
      </div>

      {openJour &&
        (() => {
          const jour = jours.find((j) => j.jour === openJour)
          if (!jour) return null
          return (
            <div className="mt-4 rounded-xl border border-primary/30 bg-accent/30 p-4">
              <div className="mb-3">
                <p className="font-heading text-sm font-semibold text-foreground">
                  Modifier {jour.jour}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: "#B7AEDC" }}
                    aria-hidden
                  />
                  Concentration
                </span>
                <LevelSelect
                  options={concentrationOptions}
                  value={jour.focus}
                  onChange={(v) => updateJour(jour.jour, { focus: v })}
                  ariaLabel={`Concentration ${jour.jour}`}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {champs.map((c) => (
                  <label key={c.key} className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                        aria-hidden
                      />
                      {c.label} (h)
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={16}
                      step={0.5}
                      value={jour[c.key]}
                      onChange={(e) =>
                        updateJour(jour.jour, { [c.key]: Number(e.target.value) || 0 })
                      }
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: "#f6d6c9" }}
                    aria-hidden
                  />
                  Énergie ressentie
                </span>
                <EnergieSlider
                  value={jour.energie}
                  onChange={(v) => updateJour(jour.jour, { energie: v })}
                  ariaLabel={`Énergie ${jour.jour}`}
                />
              </div>
            </div>
          )
        })()}
    </div>
  )
}
