"use client"

import { useEffect, useState } from "react"

// Jauge circulaire de l'équilibre : l'anneau reflète un score composite calculé
// à partir de toutes les données de l'accueil (énergie, capacité, rythme, focus),
// et le centre affiche le qualificatif d'équilibre global (Équilibré, Fragile…).
// L'anneau se remplit progressivement au montage puis respire doucement.
export function WellbeingRing({ score, ressenti }: { score: number; ressenti: string }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius

  // On part d'un anneau vide, puis on l'anime vers la valeur réelle après le montage.
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(score))
    return () => cancelAnimationFrame(id)
  }, [score])

  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="ring-breathe relative flex size-44 items-center justify-center">
      <svg
        className="size-44 -rotate-90"
        viewBox="0 0 160 160"
        role="img"
        aria-label={`Ton équilibre cette semaine : ${ressenti} (${score} sur 100)`}
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="oklch(0.93 0.012 95)"
          strokeWidth="12"
        />
        <circle
          className="ring-progress"
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#a7c8a0"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex max-w-[7.5rem] flex-col items-center text-center">
        <span className="text-balance text-lg font-semibold leading-tight tracking-tight text-foreground">
          {ressenti}
        </span>
        <span className="mt-1 text-xs font-medium text-muted-foreground">cette semaine</span>
      </div>
    </div>
  )
}
